package com.trainingplatform.config;

import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI trainingPlatformOpenAPI() {

        return new OpenAPI()

                .info(new Info()

                        .title("Training Platform API")

                        .description("REST API for the Intelligent Training & Certification Management Platform")

                        .version("1.0.0")

                        .contact(new Contact()
                                .name("K Dridi")
                                .email("your-email@example.com"))

                        .license(new License()
                                .name("MIT License")))

                .externalDocs(new ExternalDocumentation()
                        .description("Project Documentation"));
    }
}