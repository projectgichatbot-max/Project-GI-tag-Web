"""
response_generator.py — Structured Response Generation for Uttarakhand GI Tags Chatbot
"""

import logging
from typing import Optional

logger = logging.getLogger(__name__)


class ResponseGenerator:
    """Generates structured, filler-free responses for GI tag queries."""

    def __init__(self) -> None:
        pass

    def format_details(self, record: dict) -> str:
        """Format the details of a GI tag based on its category."""
        category = record.get("category", "")
        name = record.get("name", "")
        region = record.get("region", "")
        description = record.get("description", "")
        registration = record.get("registration", "Details not available")
        
        parts = []
        parts.append(name)
        parts.append("\nCategory:")
        parts.append(category)
        parts.append("\nRegion:")
        parts.append(region)
        parts.append("\nDescription:")
        parts.append(description)
        
        if category == "Handicraft":
            # Uses
            uses = record.get("uses", [])
            if uses:
                parts.append("\nUses:")
                for use in uses:
                    parts.append(f"* {use}")
            # Examples
            examples = record.get("examples", [])
            if examples:
                parts.append("\nExamples:")
                for ex in examples:
                    parts.append(f"* {ex}")
                    
        elif category == "Food Product":
            # Ingredients
            ingredients = record.get("ingredients", [])
            if ingredients:
                parts.append("\nIngredients:")
                for ing in ingredients:
                    parts.append(f"* {ing}")
            # Recipe
            recipe = record.get("recipe", [])
            if recipe:
                parts.append("\nRecipe:")
                for idx, step in enumerate(recipe, start=1):
                    parts.append(f"{idx}. {step}")
            # Uses
            uses = record.get("uses", [])
            if uses:
                parts.append("\nUses:")
                for use in uses:
                    parts.append(f"* {use}")
                    
        else:
            # Agricultural Product, Textile, etc.
            characteristics = record.get("examples", [])
            if characteristics:
                parts.append("\nCharacteristics:")
                for char in characteristics:
                    parts.append(f"* {char}")
            # Uses
            uses = record.get("uses", [])
            if uses:
                parts.append("\nUses:")
                for use in uses:
                    parts.append(f"* {use}")
                    
        parts.append("\nGI Registration:")
        parts.append(registration)
        
        return "\n".join(parts)

    def format_recipe(self, record: dict) -> str:
        """Format the recipe details of a food/agricultural GI tag."""
        recipe_title = record.get("recipe_title", "")
        name = record.get("name", "")
        
        # Remove "Uttarakhand " prefix from name for display in GI Product field if present
        display_name = name
        if name.startswith("Uttarakhand "):
            display_name = name[len("Uttarakhand "):]
            
        region = record.get("region", "")
        recipe_description = record.get("recipe_description", "")
        ingredients = record.get("ingredients", [])
        recipe_steps = record.get("recipe", [])
        uses = record.get("uses", [])
        description = record.get("description", "")
        
        parts = []
        parts.append(recipe_title)
        parts.append("\nGI Product:")
        parts.append(display_name)
        parts.append("\nRegion:")
        parts.append(region)
        parts.append("\nDescription:")
        parts.append(recipe_description)
        
        if ingredients:
            parts.append("\nIngredients:")
            for ing in ingredients:
                parts.append(f"* {ing}")
                
        if recipe_steps:
            parts.append("\nPreparation Steps:")
            for idx, step in enumerate(recipe_steps, start=1):
                parts.append(f"{idx}. {step}")
                
        if uses:
            parts.append("\nUses:")
            for use in uses:
                parts.append(f"* {use}")
                
        parts.append("\nTraditional Significance:")
        parts.append(description)
        
        return "\n".join(parts)

    def generate_response(self, data: dict, tag: str) -> str:
        """Compatibility wrapper that formats GI tag details."""
        return self.format_details(data)

    def generate_rejection_response(self) -> str:
        """Returns the fixed rejection message for invalid queries."""
        return "Not a valid Uttarakhand GI Tag query."

    def generate_not_found_response(self, tag: Optional[str] = None) -> str:
        """Returns the fixed rejection message since not found is also invalid."""
        return "Not a valid Uttarakhand GI Tag query."
