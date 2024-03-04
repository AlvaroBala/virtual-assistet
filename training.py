import spacy
from spacy.training import Example
import random

# Your raw data
raw_data = [
    ('1', 'Heater not working', 'Please check if the heater is plugged in and the thermostat is set correctly.', 'heater malfunction'),
    ('2', 'Water leak in bathroom', 'Please turn off the main water supply and call a plumber immediately.', 'bathroom flooding'),
    ('2', 'Water leak in bathroom', 'Please turn off the main water supply and call a plumber immediately.', 'bathroom water overflow'),
    ('2', 'Water leak in bathroom', 'Please turn off the main water supply and call a plumber immediately.', 'water pipe burst'),
    ('3', 'How to reset the heater', 'To reset the heater, unplug it for 30 seconds and then plug it back in.', 'heater reset'),
    ('3', 'How to reset the heater', 'To reset the heater, unplug it for 30 seconds and then plug it back in.', 'resetting heater'),
    ('4', 'What to do if the tap is leaking', 'If the tap is leaking, try tightening the valve. If it persists, please call a plumber.', 'fixing leaky tap'),
    ('4', 'What to do if the tap is leaking', 'If the tap is leaking, try tightening the valve. If it persists, please call a plumber.', 'tap dripping'),
    ('4', 'What to do if the tap is leaking', 'If the tap is leaking, try tightening the valve. If it persists, please call a plumber.', 'tighten leaky valve'),
    ('5', 'Hi', 'Hello, how can I assist you?', 'afternoon hello'),
    ('5', 'Hi', 'Hello, how can I assist you?', 'evening salutation'),
    ('5', 'Hi', 'Hello, how can I assist you?', 'greeting chatbot'),
    ('5', 'Hi', 'Hello, how can I assist you?', 'greeting response'),
    ('5', 'Hi', 'Hello, how can I assist you?', 'morning greeting'),
    ('5', 'Hi', 'Hello, how can I assist you?', 'say hello'),
    ('6', 'I need help', 'Sure, what do you need help with?', 'help needed'),
    ('6', 'I need help', 'Sure, what do you need help with?', 'issue support'),
    ('6', 'I need help', 'Sure, what do you need help with?', 'need assistance'),
    ('6', 'I need help', 'Sure, what do you need help with?', 'problem assistance'),
    ('6', 'I need help', 'Sure, what do you need help with?', 'requesting support'),
    ('7', 'Thank you', 'You’re welcome! Can I help with anything else?', 'appreciation'),
    ('7', 'Thank you', 'You’re welcome! Can I help with anything else?', 'being grateful'),
    ('7', 'Thank you', 'You’re welcome! Can I help with anything else?', 'expressing gratitude'),
    ('7', 'Thank you', 'You’re welcome! Can I help with anything else?', 'saying thanks'),
    ('7', 'Thank you', 'You’re welcome! Can I help with anything else?', 'thank you reply'),
    ('8', 'What services do you offer?', 'We provide assistance with water leaks, AC, and heater repairs.', 'assistance provided'),
    ('8', 'What services do you offer?', 'We provide assistance with water leaks, AC, and heater repairs.', 'repair services'),
    ('8', 'What services do you offer?', 'We provide assistance with water leaks, AC, and heater repairs.', 'service offerings'),
    ('8', 'What services do you offer?', 'We provide assistance with water leaks, AC, and heater repairs.', 'services available'),
    ('8', 'What services do you offer?', 'We provide assistance with water leaks, AC, and heater repairs.', 'what we provide'),
    ('9', 'How to detect a water leak?', 'You can detect a water leak by checking for wet spots on the walls, floors, or listening for the sound of running water.', 'finding water leaks'),
    ('9', 'How to detect a water leak?', 'You can detect a water leak by checking for wet spots on the walls, floors, or listening for the sound of running water.', 'hearing water running'),
    ('9', 'How to detect a water leak?', 'You can detect a water leak by checking for wet spots on the walls, floors, or listening for the sound of running water.', 'signs of water leak'),
    ('9', 'How to detect a water leak?', 'You can detect a water leak by checking for wet spots on the walls, floors, or listening for the sound of running water.', 'water leak detection'),
    ('9', 'How to detect a water leak?', 'You can detect a water leak by checking for wet spots on the walls, floors, or listening for the sound of running water.', 'water leak spotting'),
    ('10', 'AC maintenance tips?', 'Regular maintenance for AC includes cleaning or replacing filters, checking the thermostat, and ensuring the outside unit is clear of debris.', 'AC care tips'),
    ('10', 'AC maintenance tips?', 'Regular maintenance for AC includes cleaning or replacing filters, checking the thermostat, and ensuring the outside unit is clear of debris.', 'AC upkeep advice'),
    ('10', 'AC maintenance tips?', 'Regular maintenance for AC includes cleaning or replacing filters, checking the thermostat, and ensuring the outside unit is clear of debris.', 'air conditioner care'),
    ('10', 'AC maintenance tips?', 'Regular maintenance for AC includes cleaning or replacing filters, checking the thermostat, and ensuring the outside unit is clear of debris.', 'cleaning AC filters'),
    ('10', 'AC maintenance tips?', 'Regular maintenance for AC includes cleaning or replacing filters, checking the thermostat, and ensuring the outside unit is clear of debris.', 'maintaining air conditioner'),
    ('11', 'Heater is not turning on, what to do?', 'If your heater is not turning on, check the thermostat settings, power supply, and if the pilot light is on for gas heaters.', 'checking heater thermostat'),
    ('11', 'Heater is not turning on, what to do?', 'If your heater is not turning on, check the thermostat settings, power supply, and if the pilot light is on for gas heaters.', 'gas heater pilot light'),
    ('11', 'Heater is not turning on, what to do?', 'If your heater is not turning on, check the thermostat settings, power supply, and if the pilot light is on for gas heaters.', 'heater troubleshooting'),
    ('11', 'Heater is not turning on, what to do?', 'If your heater is not turning on, check the thermostat settings, power supply, and if the pilot light is on for gas heaters.', 'heater won’t start'),
    ('12', 'Why is my AC unit not working?', 'There are several reasons why an AC unit may not be working, including issues with the thermostat, a tripped breaker, or a refrigerant leak. Please check if the thermostat is set to cool and that the breaker has not been tripped. If the problem persists, it may require professional service.', 'AC cooling problem'),
    ('12', 'Why is my AC unit not working?', 'There are several reasons why an AC unit may not be working, including issues with the thermostat, a tripped breaker, or a refrigerant leak. Please check if the thermostat is set to cool and that the breaker has not been tripped. If the problem persists, it may require professional service.', 'AC refrigerant issue'),
    ('12', 'Why is my AC unit not working?', 'There are several reasons why an AC unit may not be working, including issues with the thermostat, a tripped breaker, or a refrigerant leak. Please check if the thermostat is set to cool and that the breaker has not been tripped. If the problem persists, it may require professional service.', 'AC service request'),
    ('12', 'Why is my AC unit not working?', 'There are several reasons why an AC unit may not be working, including issues with the thermostat, a tripped breaker, or a refrigerant leak. Please check if the thermostat is set to cool and that the breaker has not been tripped. If the problem persists, it may require professional service.', 'AC thermostat setting'),
    ('12', 'Why is my AC unit not working?', 'There are several reasons why an AC unit may not be working, including issues with the thermostat, a tripped breaker, or a refrigerant leak. Please check if the thermostat is set to cool and that the breaker has not been tripped. If the problem persists, it may require professional service.', 'AC troubleshooting'),
    ('12', 'Why is my AC unit not working?', 'There are several reasons why an AC unit may not be working, including issues with the thermostat, a tripped breaker, or a refrigerant leak. Please check if the thermostat is set to cool and that the breaker has not been tripped. If the problem persists, it may require professional service.', 'AC unit failure'),
    ('12', 'Why is my AC unit not working?', 'There are several reasons why an AC unit may not be working, including issues with the thermostat, a tripped breaker, or a refrigerant leak. Please check if the thermostat is set to cool and that the breaker has not been tripped. If the problem persists, it may require professional service.', 'air conditioner issues'),
    ('12', 'Why is my AC unit not working?', 'There are several reasons why an AC unit may not be working, including issues with the thermostat, a tripped breaker, or a refrigerant leak. Please check if the thermostat is set to cool and that the breaker has not been tripped. If the problem persists, it may require professional service.', 'tripped AC breaker'),
    ('13', 'How to fix a jammed door?', 'To fix a jammed door, check for any obstructions in the track for sliding doors or for any warping or swelling in the case of hinged doors. Lubricating the hinges or tracks might also solve the issue. If the door is stuck due to paint, you might need to use a putty knife to gently break the seal.', 'door obstructions'),
    ('13', 'How to fix a jammed door?', 'To fix a jammed door, check for any obstructions in the track for sliding doors or for any warping or swelling in the case of hinged doors. Lubricating the hinges or tracks might also solve the issue. If the door is stuck due to paint, you might need to use a putty knife to gently break the seal.', 'door repair'),
    ('13', 'How to fix a jammed door?', 'To fix a jammed door, check for any obstructions in the track for sliding doors or for any warping or swelling in the case of hinged doors. Lubricating the hinges or tracks might also solve the issue. If the door is stuck due to paint, you might need to use a putty knife to gently break the seal.', 'door stuck'),
    ('13', 'How to fix a jammed door?', 'To fix a jammed door, check for any obstructions in the track for sliding doors or for any warping or swelling in the case of hinged doors. Lubricating the hinges or tracks might also solve the issue. If the door is stuck due to paint, you might need to use a putty knife to gently break the seal.', 'door warping'),
    ('13', 'How to fix a jammed door?', 'To fix a jammed door, check for any obstructions in the track for sliding doors or for any warping or swelling in the case of hinged doors. Lubricating the hinges or tracks might also solve the issue. If the door is stuck due to paint, you might need to use a putty knife to gently break the seal.', 'fix door'),
    ('13', 'How to fix a jammed door?', 'To fix a jammed door, check for any obstructions in the track for sliding doors or for any warping or swelling in the case of hinged doors. Lubricating the hinges or tracks might also solve the issue. If the door is stuck due to paint, you might need to use a putty knife to gently break the seal.', 'jammed door'),
    ('13', 'How to fix a jammed door?', 'To fix a jammed door, check for any obstructions in the track for sliding doors or for any warping or swelling in the case of hinged doors. Lubricating the hinges or tracks might also solve the issue. If the door is stuck due to paint, you might need to use a putty knife to gently break the seal.', 'lubricate hinges'),
    ('13', 'How to fix a jammed door?', 'To fix a jammed door, check for any obstructions in the track for sliding doors or for any warping or swelling in the case of hinged doors. Lubricating the hinges or tracks might also solve the issue. If the door is stuck due to paint, you might need to use a putty knife to gently break the seal.', 'swollen door'),
    ('13', 'How to fix a jammed door?', 'To fix a jammed door, check for any obstructions in the track for sliding doors or for any warping or swelling in the case of hinged doors. Lubricating the hinges or tracks might also solve the issue. If the door is stuck due to paint, you might need to use a putty knife to gently break the seal.', 'track obstruction'),
    ('13', 'How to fix a jammed door?', 'To fix a jammed door, check for any obstructions in the track for sliding doors or for any warping or swelling in the case of hinged doors. Lubricating the hinges or tracks might also solve the issue. If the door is stuck due to paint, you might need to use a putty knife to gently break the seal.', 'unstick door'),
    # ... and so on for any other entries you may have ...
]
# Function to convert raw data to spaCy training data format
def convert_to_spacy_format(raw_data, nlp):
    TRAIN_DATA = []
    for entry in raw_data:
        text = entry[1]
        keywords = entry[3].split()
        entities = []
        for keyword in keywords:
            start_index = text.lower().find(keyword.lower())  # Case-insensitive matching
            if start_index != -1:
                end_index = start_index + len(keyword)
                entities.append((start_index, end_index, "KEYWORD"))
        if entities:
            TRAIN_DATA.append((text, {"entities": entities}))
    return TRAIN_DATA

# Load a blank English spaCy model
nlp = spacy.blank("en")

# Create the training data
TRAIN_DATA = convert_to_spacy_format(raw_data, nlp)

# Manually verify a few examples from TRAIN_DATA
print("Sample training data:", TRAIN_DATA[:5])

# Add a new entity recognizer to the pipeline
ner = nlp.add_pipe("ner")

# Add labels to the NER model
for _, annotations in TRAIN_DATA:
    for ent in annotations.get("entities"):
        ner.add_label(ent[2])

# Train the model
with nlp.disable_pipes(*[pipe for pipe in nlp.pipe_names if pipe != "ner"]):
    optimizer = nlp.begin_training()
    for itn in range(10):
        random.shuffle(TRAIN_DATA)
        losses = {}
        batches = spacy.util.minibatch(TRAIN_DATA, size=4)
        for batch in batches:
            texts, annotations = zip(*batch)
            examples = [Example.from_dict(nlp.make_doc(text), annotation) for text, annotation in zip(texts, annotations)]
            nlp.update(examples, drop=0.5, sgd=optimizer, losses=losses)
        print(f"Iteration {itn}, Losses: {losses}")

# Save the model
nlp.to_disk("./trained_ner_model")

# Test the trained model
model_path = "./trained_ner_model"
nlp2 = spacy.load(model_path)

test_texts = [
    "Hi",
    "Thank you",
    "What services do you offer?"
]

for test_text in test_texts:
    doc = nlp2(test_text)
    print(f"Text: {test_text}, Entities: {[(ent.text, ent.label_) for ent in doc.ents]}")