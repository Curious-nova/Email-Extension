package com.email.writer.app;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
public class EmailGeneratorService {

    private final WebClient webClient;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    public EmailGeneratorService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    // Call API and generate email reply
    public String generateEmailReply(EmailRequest emailRequest) {
        // Build the prompt
        String prompt = buildPrompt(emailRequest);

        // Craft the request
        Map<String, Object> requestBody = Map.of(
                "contents", new Object[]{
                        Map.of("parts", new Object[]{
                                Map.of("text", prompt)
                        })
                }
        );

        // Make the request to the Gemini API
        String response = webClient.post()
                .uri(geminiApiUrl + "?key=" + geminiApiKey)  // Corrected to include `?key=` for query params
                .header("Content-Type", "application/json")
                .bodyValue(requestBody) // Corrected to pass the request body properly
                .retrieve()
                .bodyToMono(String.class)
                .block();

        // Extract response and return content
        return extractResponseContent(response);
    }

    // Extract response content from the API response
    private String extractResponseContent(String response) {
        try {
            ObjectMapper mapper = new ObjectMapper(); // It can convert JSON to Java objects and vice versa

            JsonNode rootNode = mapper.readTree(response);
            return rootNode.path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();
        } catch (Exception e) {
            return "Error processing request: " + e.getMessage();
        }
    }

    // Build prompt dynamically based on emailRequest data
    private String buildPrompt(EmailRequest emailRequest) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("Generate a professional email reply for the following email content. Please don't generate a subject line.");

        if (emailRequest.getTones() != null && !emailRequest.getTones().isEmpty()) {
            prompt.append(" Use a ").append(emailRequest.getTones()).append(" tone.");
        }

        prompt.append("\nOriginal Email:\n").append(emailRequest.getEmailContent());
        return prompt.toString();
    }
}
