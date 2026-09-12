import re

text = """The seven-arm octopus (Haliphron atlanticus), also known as the blob octopus or sometimes called septopus, is one of the two largest known species of octopus; the largest specimen ever discovered had an estimated total length of 3.5 m (11 ft) and mass of 75 kg (165 lb).[3][4] The only other similarly large extant species is the giant Pacific octopus, Enteroctopus dofleini.
The genera Alloposina Grimpe, 1922, Alloposus Verrill, 1880 and Heptopus Joubin, 1929 are junior synonyms of Haliphron, a monotypic genus in the monotypic family Alloposidae, part of the superfamily Argonautoidea in the suborder Incirrata of the order Octopoda.[2]
Description
Egg string and embryos of H. atlanticus collected north of the Cape Verde Islands (17°24′N 22°57′W): The eggs measure around 8 mm at their widest.
The seven-arm octopus is so named because in males, the hectocotylus (a specially modified arm used in egg fertilization) is coiled in a sac beneath the right eye. Due to this species' thick, gelatinous tissue, the arm is easily overlooked, giving the appearance of just seven arms. However, like other octopuses, it actually has eight.[citation needed]
Distribution
The type specimen of H. atlanticus was collected in the Atlantic Ocean at 38°N 34°W (west of the Azores). It is deposited at the University of Copenhagen Zoological Museum.[5]
Since then, several specimens have been caught throughout the Atlantic, as far as the Azores archipelago[6] and near South Georgia Island.[7]
In 2002, a single specimen of giant proportions was caught by fishermen trawling at a depth of 920 m off the eastern Chatham Rise, New Zealand. This specimen, the largest of this species and of all octopuses, was the first validated record of Haliphron from the South Pacific. It had a mantle length of 0.69 m (2.3 ft), a total length of 2.90 m (9.5 ft), and a weight of 61.0 kg (134.5 lb), although it was incomplete.[3][4]"""


def chunker(text: str, sentences_per_chunk: int, min_length_chunk: int) -> list[str]:
    """Divides up the text into chunks of a certain length"""
    text_chunks = re.split(r"\.\s+|\?\s+|!\s+", text)
    processed_chunks = []
    grouped_chunks = [
        text_chunks[i : i + sentences_per_chunk]
        for i in range(0, len(text_chunks), sentences_per_chunk)
    ]
    for chunk in grouped_chunks:
        chunk = " ".join(chunk)
        if len(chunk) > min_length_chunk:
            processed_chunks.append(chunk)

    return processed_chunks
