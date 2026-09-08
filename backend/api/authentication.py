from __future__ import annotations

import logging
from typing import Any

import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.exceptions import ImproperlyConfigured
from jwt import PyJWKClient
from jwt.exceptions import PyJWKClientError
from rest_framework.authentication import BaseAuthentication, get_authorization_header
from rest_framework.exceptions import AuthenticationFailed

logger = logging.getLogger(__name__)


class ClerkJWTAuthentication(BaseAuthentication):
    """Validate Clerk bearer tokens and synchronize the local user record."""

    keyword = b"bearer"
    jwks_client = None

    def authenticate(self, request):
        parts = get_authorization_header(request).split()
        if not parts:
            return None
        if len(parts) != 2 or parts[0].lower() != self.keyword:
            raise AuthenticationFailed("Authorization header must use Bearer <token>.")

        token = parts[1].decode("utf-8")
        if not settings.CLERK_JWKS_URL:
            raise ImproperlyConfigured("CLERK_JWKS_URL must be configured for protected requests.")

        try:
            if self.jwks_client is None or self.jwks_client.uri != settings.CLERK_JWKS_URL:
                self.jwks_client = PyJWKClient(settings.CLERK_JWKS_URL, cache_keys=True)
            signing_key = self.jwks_client.get_signing_key_from_jwt(token).key
            decode_options: dict[str, Any] = {"algorithms": ["RS256"]}
            if settings.CLERK_ISSUER:
                decode_options["issuer"] = settings.CLERK_ISSUER.rstrip("/")
            if settings.CLERK_AUDIENCE:
                decode_options["audience"] = settings.CLERK_AUDIENCE
            else:
                decode_options["options"] = {"verify_aud": False}
            claims = jwt.decode(token, signing_key, leeway=10, **decode_options)
        except (jwt.PyJWTError, PyJWKClientError, OSError) as exc:
            logger.warning("Clerk JWT verification failed: %s", type(exc).__name__)
            raise AuthenticationFailed("Invalid or expired Clerk token.") from exc

        clerk_id = claims.get("sub")
        if not clerk_id:
            raise AuthenticationFailed("Clerk token is missing the subject claim.")

        user_model = get_user_model()
        email = claims.get("email") or claims.get("email_address") or f"{clerk_id}@clerk.local"
        user, _ = user_model.objects.update_or_create(
            clerk_id=clerk_id,
            defaults={
                "username": clerk_id,
                "email": email,
                "first_name": claims.get("first_name", ""),
                "last_name": claims.get("last_name", ""),
                "is_active": True,
            },
        )
        return user, token

    def authenticate_header(self, request):
        return "Bearer"
