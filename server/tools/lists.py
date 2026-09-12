from pydantic_settings import BaseSettings

DECK_NAMES = [
    "My Amazing Deck",
    "Cephalopod Chronicles",
    "Fun with Flashcards",
    "Tentacle Trivia Trove",
    "Octopus Odyssey Deck",
    "Dazzling Deck Dive",
    "Squid Squad Saga",
    "Dynamic Deck Dispenser",
    "Cuttlefish Curriculum",
    "Nautilus Nuggets Deck",
    "Kraken Knowledge Kit",
    "Jubilant Jellyfish Journey",
    "Bobtail Squid Brainstorm",
    "Dumbo Octopus Deck",
    "Giant Pacific Wisdom Well",
    "Flamboyant Cuttlefish Fiesta",
    "This Deck Absolutely Rocks",
    "Brainy Bluering Deck",
    "Color-Changing Cuttlefish Craze",
    "Cephalopod Cognition Capsule",
    "Cephalopod Carnival Deck",
    "Tentacle Tango Triumph",
    "Octopus Omnibus of Omniscience",
    "Squid Savvy Series",
    "Colossal Squid Compendium",
    "Flashcard Fiesta with Fins",
    "Nautilus Navigator Notebook",
    "Cuttlefish Cognition Carnival",
    "Ink-Squirting Illumination Ideas",
    "Bluering Brain Boosting Bundle",
    "Giant Squid Gargantuan Grasp",
    "Mollusk Mentality Masterclass",
    "Chromatophore Charade Challenge",
    "Firefly Squid Fact Fiesta",
    "This Deck is Tenta-Cool",
    "Argonaut Academic Arsenal",
    "Vampire Squid Vocabulary Vault",
    "Deepsea Cognition Capsule",
    "Cockatoo Squid Conundrum Crate",
    "Glowing Sucker Octopus Gala",
]


TEST_NAMES = [
    "Squid ink challenge",
    "Octopus intelligence inquiry",
    "Nautilus knowledge ninja",
    "Cuttlefish quiz quest",
    "Tentacle test time",
    "Kraken knowledge knockout",
    "Jellyfish genius joust",
    "Bobtail squid brain buster",
    "Dumbo octopus ordeal",
    "Giant pacific puzzle pursuit",
    "This test rocks your socks",
    "Flamboyant cuttlefish festival",
    "Ink-filled intelligence invasion",
    "Brainy bluering battle",
    "Color-changing cuttlefish conundrum",
    "Underwater umbrella octopus undertaking",
    "Argonaut adventure assessment",
    "Vampire squid voyage verification",
    "Cephalopod cognition check",
    "Bioluminescent bobtail barrage",
    "Cephalopod cognition craze",
    "Tentacle triumph test",
    "Octopus omnibus ordeal",
    "Squid savvy showdown",
    "Colossal squid conquest",
    "Underwater universities unveiled",
    "Nautilus navigator necessity",
    "Cuttlefish curiosity cue",
    "Ink-filled inquisition invasion",
    "Bluering brain buster bout",
    "Giant squid grapple game",
    "Mollusk mentality measurement",
    "Chromatophore charade check",
    "Firefly squid fact finder",
    "This test is in tenta-tion",
    "Argonaut academic assessment",
    "Vampire squid vocabulary verification",
    "Deepsea dominion determination",
    "Cockatoo squid conundrum catch",
    "Glowing octopus grit",
]

SOURCE_FILE_NAMES = [
    "Cephalopod coded sources",
    "Octopus origin outlines",
    "Squid savvy source scripts",
    "Nautilus navigator notations",
    "Cuttlefish content caches",
    "Tentacle terrific text",
    "Kraken knowledge keys",
    "Mollusk mainframe manuals",
    "Chromatophore charade chapters",
    "Firefly squid fact files",
]

TRANSCRIPTION_FILE_NAMES = [
    "Dumbo octopus dialogues",
    "Bluering octopus briefings",
    "Cockatoo squid conversations",
    "Bobtail squid banter",
    "Flapjack octopus feedback",
    "Humboldt squid hearsay",
    "Jellyfish jargon journals",
    "Giant squid speeches",
    "Vampire squid verbosity",
    "Argonaut academic addresses",
]

SUMMARY_FILE_NAMES = [
    "Cephalopod Compendium Codex",
    "Octopus Outline Archive",
    "Squid Summary Symposium",
    "Nautilus Navigator Manual",
    "Cuttlefish KnowledgeCapsule",
    "Tentacle Treatise Texts",
    "Kraken Keynote Anthology",
    "Mollusk Methodology Memoirs",
    "Chromatophore Case Study",
    "Firefly Squid Research Report",
]

NOTES_FILE_NAMES = [
    "Dumbo octopus doodles",
    "Bluering octopus bulletins",
    "Cockatoo squid cliffnotes",
    "Bobtail squid briefings",
    "Flapjack octopus footnotes",
    "Humboldt squid highlights",
    "Jellyfish jotdown journals",
    "Giant squid graffiti",
    "Vampire squid vignettes",
    "Argonaut academic annotations",
]


class RandomNames(BaseSettings):
    deck_names: list[str] = DECK_NAMES
    test_names: list[str] = TEST_NAMES
    source_file_names: list[str] = SOURCE_FILE_NAMES
    transcription_file_names: list[str] = TRANSCRIPTION_FILE_NAMES
    summary_file_names: list[str] = SUMMARY_FILE_NAMES
    notes_file_names: list[str] = NOTES_FILE_NAMES
