package com.trainingplatform.security.oauth;

import com.trainingplatform.user.entity.User;
import com.trainingplatform.user.enums.AuthProvider;
import com.trainingplatform.user.enums.Role;
import com.trainingplatform.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private static final String EMAIL_ATTRIBUTE = "email";
    private static final String PROVIDER_ID_ATTRIBUTE = "sub";
    private static final String GIVEN_NAME_ATTRIBUTE = "given_name";
    private static final String FAMILY_NAME_ATTRIBUTE = "family_name";
    private static final String NAME_ATTRIBUTE = "name";
    private static final String PICTURE_ATTRIBUTE = "picture";

    private static final String DEFAULT_AVATAR_URL =
            "https://res.cloudinary.com/dqrtwfpbq/image/upload/v1785902252/avatar_jbenlj.png";

    private final UserRepository userRepository;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        OAuth2User oAuth2User = super.loadUser(userRequest);
        Map<String, Object> attributes = new HashMap<>(oAuth2User.getAttributes());

        String email = getRequiredAttribute(attributes, EMAIL_ATTRIBUTE);
        String providerId = getRequiredAttribute(attributes, PROVIDER_ID_ATTRIBUTE);
        String firstName = resolveFirstName(attributes, email);
        String lastName = resolveLastName(attributes, email);
        String picture = getOptionalAttribute(attributes, PICTURE_ATTRIBUTE);

        User user = userRepository.findByEmail(email)
                .map(existingUser -> updateExistingGoogleAccount(existingUser, providerId, picture))
                .orElseGet(() -> createGoogleUser(email, providerId, firstName, lastName, picture));

        userRepository.save(user);

        return new DefaultOAuth2User(
                user.getAuthorities(),
                attributes,
                EMAIL_ATTRIBUTE
        );
    }

    private User updateExistingGoogleAccount(User user, String providerId, String picture) {

        user.setProvider(AuthProvider.GOOGLE);
        user.setProviderId(providerId);
        user.setEnabled(true);

        if (shouldUseGooglePicture(user, picture)) {
            user.setAvatarUrl(picture);
            user.setAvatarPublicId(null);
        }

        return user;
    }

    private User createGoogleUser(
            String email,
            String providerId,
            String firstName,
            String lastName,
            String picture
    ) {

        return User.builder()
                .firstName(firstName)
                .lastName(lastName)
                .email(email)
                .password(null)
                .phone(null)
                .role(Role.LEARNER)
                .provider(AuthProvider.GOOGLE)
                .providerId(providerId)
                .enabled(true)
                .avatarUrl(isBlank(picture) ? DEFAULT_AVATAR_URL : picture)
                .avatarPublicId(null)
                .build();
    }

    private boolean shouldUseGooglePicture(User user, String picture) {
        return !isBlank(picture)
                && (user.getAvatarPublicId() == null || user.getAvatarPublicId().isBlank())
                && (user.getAvatarUrl() == null
                || user.getAvatarUrl().isBlank()
                || DEFAULT_AVATAR_URL.equals(user.getAvatarUrl()));
    }

    private String resolveFirstName(Map<String, Object> attributes, String email) {
        String givenName = getOptionalAttribute(attributes, GIVEN_NAME_ATTRIBUTE);
        if (!isBlank(givenName)) {
            return givenName;
        }

        String fullName = getOptionalAttribute(attributes, NAME_ATTRIBUTE);
        if (!isBlank(fullName)) {
            String[] parts = fullName.trim().split("\\s+");
            return parts[0];
        }

        return email.split("@")[0];
    }

    private String resolveLastName(Map<String, Object> attributes, String email) {
        String familyName = getOptionalAttribute(attributes, FAMILY_NAME_ATTRIBUTE);
        if (!isBlank(familyName)) {
            return familyName;
        }

        String fullName = getOptionalAttribute(attributes, NAME_ATTRIBUTE);
        if (!isBlank(fullName)) {
            String[] parts = fullName.trim().split("\\s+");
            if (parts.length > 1) {
                return parts[parts.length - 1];
            }
        }

        return "Google";
    }

    private String getRequiredAttribute(Map<String, Object> attributes, String key) {
        String value = getOptionalAttribute(attributes, key);
        if (isBlank(value)) {
            throw new OAuth2AuthenticationException(
                    new OAuth2Error("invalid_user_info"),
                    key + " not found from OAuth2 provider."
            );
        }
        return value;
    }

    private String getOptionalAttribute(Map<String, Object> attributes, String key) {
        Object value = attributes.get(key);
        return value == null ? null : value.toString();
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}