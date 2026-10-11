
from sqlmodel import Session, select

from app.backend.models import SafetyGuideline

from app.backend.db import engine



EWASTE_RULES = (
    "E-Waste (Management) Rules, 2022, as amended; "
    "https://eprewaste.cpcb.gov.in/assets/PDF/e-waste_rules_2022.pdf"
)
CPCB_FAQ = (
    "CPCB, FAQ under E-Waste (Management) Rules, 2022; "
    "https://cpcb.nic.in/uploads/Projects/E-Waste/FAQ_ewaste_23012024.pdf"
)
BATTERY_RULES = (
    "Battery Waste Management Rules, 2022, as amended; "
    "https://eprbattery.cpcb.gov.in/"
)

SAFETY_GUIDELINES = [
    # MOBILE PHONES
    {
        "material_category": "mobile_phone",
        "hazard_type": "Lithium battery",
        "rule_text": (
            "Inspect for swelling, punctures, leakage or unusual heat. "
            "Do not charge, crush, bend or dismantle a damaged phone. "
            "Keep it away from heat and ignition sources. If the battery "
            "is swollen or damaged, isolate it from ordinary items and "
            "contact a qualified battery-waste handler."
        ),
        "source_reference": f"Battery safety guidance; {BATTERY_RULES}",
    },
    {
        "material_category": "mobile_phone",
        "hazard_type": "Broken glass",
        "rule_text": (
            "Handle cracked screens carefully. Avoid direct contact with "
            "exposed glass and internal components. Use suitable cut-resistant "
            "gloves when handling broken devices and place sharp fragments "
            "in a rigid, secure container."
        ),
        "source_reference": f"Supplementary handling guidance; {CPCB_FAQ}",
    },
    {
        "material_category": "mobile_phone",
        "hazard_type": "Personal data",
        "rule_text": (
            "Before transfer for reuse or recycling, back up required data, "
            "sign out of accounts, remove SIM and memory cards, and perform "
            "a factory reset where possible. Do not access or disclose "
            "the previous owner's personal information."
        ),
        "source_reference": (
            "Supplementary data-security guidance; "
            "https://eprewaste.cpcb.gov.in/"
        ),
    },

    # LAPTOPS
    {
        "material_category": "laptop",
        "hazard_type": "Lithium battery",
        "rule_text": (
            "Check the laptop for a swollen battery, distorted casing, "
            "leakage or unusual heat. Do not puncture, compress or attempt "
            "to remove an integrated battery unless qualified to do so. "
            "Route damaged batteries to an appropriate specialist."
        ),
        "source_reference": f"Battery safety guidance; {BATTERY_RULES}",
    },
    {
        "material_category": "laptop",
        "hazard_type": "Electrical energy",
        "rule_text": (
            "Disconnect the charger and all peripherals before handling. "
            "Do not open power adapters or touch exposed electrical parts. "
            "Damaged adapters and devices with exposed conductors should "
            "be kept out of service and referred to a qualified handler."
        ),
        "source_reference": f"Supplementary handling guidance; {CPCB_FAQ}",
    },
    {
        "material_category": "laptop",
        "hazard_type": "Sharp components and data",
        "rule_text": (
            "Watch for sharp metal edges and broken displays. Use suitable "
            "gloves when handling damaged equipment. Protect stored data "
            "and remove personal storage media where feasible before "
            "transfer for reuse or recycling."
        ),
        "source_reference": f"Supplementary handling guidance; {CPCB_FAQ}",
    },

    # BATTERIES
    {
        "material_category": "battery",
        "hazard_type": "Fire and thermal runaway",
        "rule_text": (
            "Never crush, puncture, short-circuit or incinerate batteries. "
            "Protect terminals from contact with metal objects. Keep "
            "batteries away from heat and flammable materials. A hot, "
            "swollen, hissing or smoking battery must not be handled as "
            "ordinary scrap; move away and contact emergency services "
            "if there is an immediate fire or exposure risk."
        ),
        "source_reference": f"Battery Waste Management Rules; {BATTERY_RULES}",
    },
    {
        "material_category": "battery",
        "hazard_type": "Chemical leakage",
        "rule_text": (
            "Do not touch leaking battery chemicals with bare hands or "
            "attempt to neutralize an unknown electrolyte. Avoid inhaling "
            "fumes and prevent leakage from reaching drains or soil. "
            "Restrict access and obtain specialist assistance for damaged "
            "or leaking batteries."
        ),
        "source_reference": f"Battery safety guidance; {BATTERY_RULES}",
    },
    {
        "material_category": "battery",
        "hazard_type": "Improper disposal",
        "rule_text": (
            "Do not mix waste batteries with general household waste or "
            "ordinary recyclable scrap. Keep battery waste segregated and "
            "send it through an appropriate battery collection or recycling "
            "channel under the applicable Battery Waste Management Rules."
        ),
        "source_reference": f"Battery Waste Management Rules; {BATTERY_RULES}",
    },

    # CABLES AND WIRES
    {
        "material_category": "cable_wire",
        "hazard_type": "Electrical shock",
        "rule_text": (
            "Ensure cables and chargers are disconnected from all power "
            "sources before handling. Never assume a damaged cable is "
            "safe to touch if it may still be energized. Do not handle "
            "exposed conductors connected to live equipment."
        ),
        "source_reference": f"Supplementary handling guidance; {CPCB_FAQ}",
    },
    {
        "material_category": "cable_wire",
        "hazard_type": "Cuts and entanglement",
        "rule_text": (
            "Handle tangled wires carefully to avoid cuts, trips and "
            "entanglement. Wear suitable gloves when needed. Do not burn "
            "cable insulation to recover copper; route cables to an "
            "appropriate recycling facility."
        ),
        "source_reference": f"Environmentally sound management; {EWASTE_RULES}",
    },
    {
        "material_category": "cable_wire",
        "hazard_type": "Toxic fumes",
        "rule_text": (
            "Never burn, melt or chemically strip cable insulation in an "
            "informal recovery operation. These practices can release "
            "hazardous emissions and contaminate the environment. Use "
            "appropriate mechanical processing at a suitable facility."
        ),
        "source_reference": f"Environmentally sound management; {CPCB_FAQ}",
    },

    # CIRCUIT BOARDS
    {
        "material_category": "circuit_board",
        "hazard_type": "Heavy metals and toxic substances",
        "rule_text": (
            "Avoid breaking, grinding, sanding or burning circuit boards. "
            "Electronic components may contain lead, cadmium, mercury or "
            "other hazardous substances. Prevent dust generation and "
            "route boards to an appropriate registered recycling facility."
        ),
        "source_reference": f"CPCB FAQ on e-waste hazards; {CPCB_FAQ}",
    },
    {
        "material_category": "circuit_board",
        "hazard_type": "Sharp edges",
        "rule_text": (
            "Handle circuit boards by their edges where safe. Watch for "
            "sharp soldered leads, broken components and metal fragments. "
            "Use suitable protective gloves and eye protection when "
            "handling damaged boards."
        ),
        "source_reference": f"Supplementary handling guidance; {CPCB_FAQ}",
    },
    {
        "material_category": "circuit_board",
        "hazard_type": "Unsafe material recovery",
        "rule_text": (
            "Do not use open burning, uncontrolled acid leaching or "
            "unprotected chemical extraction to recover valuable metals. "
            "Such processes can expose workers to toxic substances and "
            "pollute soil, air and water. Send boards to an appropriate "
            "registered recycler."
        ),
        "source_reference": f"Environmentally sound management; {EWASTE_RULES}",
    },

    # SMALL APPLIANCES
    {
        "material_category": "small_appliance",
        "hazard_type": "Electrical shock",
        "rule_text": (
            "Unplug appliances before collection or handling. Do not operate "
            "equipment with exposed wires, damaged plugs or broken casings. "
            "Do not open electrical components unless qualified to do so."
        ),
        "source_reference": f"Supplementary handling guidance; {CPCB_FAQ}",
    },
    {
        "material_category": "small_appliance",
        "hazard_type": "Sharp and moving parts",
        "rule_text": (
            "Watch for exposed blades, broken plastic, sharp sheet metal "
            "and moving parts. Allow hot appliances to cool before handling. "
            "Use appropriate protective equipment when handling damaged "
            "or dismantled equipment."
        ),
        "source_reference": f"Supplementary handling guidance; {CPCB_FAQ}",
    },
    {
        "material_category": "small_appliance",
        "hazard_type": "Hazardous components",
        "rule_text": (
            "Do not break lamps, displays or sealed components to recover "
            "materials. Some equipment may contain hazardous substances "
            "or capacitors that retain electrical energy. Keep damaged "
            "components intact and refer them to qualified handlers."
        ),
        "source_reference": f"Environmentally sound management; {EWASTE_RULES}",
    },

    # LARGE APPLIANCES
    {
        "material_category": "large_appliance",
        "hazard_type": "Refrigerants and pressurized systems",
        "rule_text": (
            "For refrigerators and air conditioners, do not cut refrigerant "
            "lines, release refrigerants or dismantle sealed cooling systems. "
            "Recovery of refrigerants should be performed by appropriately "
            "trained personnel using suitable equipment."
        ),
        "source_reference": f"Environmentally sound management; {EWASTE_RULES}",
    },
    {
        "material_category": "large_appliance",
        "hazard_type": "Heavy lifting and crushing",
        "rule_text": (
            "Assess appliance weight and stability before moving. Use "
            "appropriate lifting equipment or sufficient trained personnel. "
            "Keep appliances stable and avoid placing hands or feet beneath "
            "unsecured equipment."
        ),
        "source_reference": f"Supplementary handling guidance; {CPCB_FAQ}",
    },
    {
        "material_category": "large_appliance",
        "hazard_type": "Hazardous internal components",
        "rule_text": (
            "Do not break CRT television glass, fluorescent lamps or other "
            "potentially hazardous components. Older equipment may contain "
            "lead-bearing glass, mercury-containing lamps or other hazardous "
            "materials. Keep damaged components contained and refer them "
            "to an appropriate recycling facility."
        ),
        "source_reference": f"CPCB FAQ on e-waste hazards; {CPCB_FAQ}",
    },

    # OTHER / UNKNOWN ITEMS
    {
        "material_category": "other",
        "hazard_type": "Unknown material",
        "rule_text": (
            "If the item cannot be identified confidently, do not dismantle "
            "it or expose its internal components. Keep it separate from "
            "ordinary waste until its type and appropriate handling route "
            "can be established."
        ),
        "source_reference": f"Precautionary guidance; {EWASTE_RULES}",
    },
    {
        "material_category": "other",
        "hazard_type": "Unknown battery or chemical hazard",
        "rule_text": (
            "Check for batteries, leaking fluids, damaged capacitors, "
            "lamps or other potentially hazardous components without "
            "breaking open the item. If it is leaking, unusually hot, "
            "smoking or emitting fumes, keep away and seek appropriate "
            "specialist or emergency assistance."
        ),
        "source_reference": f"Precautionary guidance; {CPCB_FAQ}",
    },
    {
        "material_category": "other",
        "hazard_type": "Unsafe disposal",
        "rule_text": (
            "Do not burn, bury, dump or dismantle unidentified electronic "
            "waste in an uncontrolled setting. Identify the equipment and "
            "direct it to the appropriate collection, battery-waste or "
            "registered e-waste recycling channel."
        ),
        "source_reference": f"Environmentally sound management; {EWASTE_RULES}",
    },
]

HINDI_TRANSLATIONS = {
    "Lithium battery": (
        "बैटरी में सूजन, छेद, रिसाव या असामान्य गर्मी की जाँच करें। "
        "क्षतिग्रस्त फोन को चार्ज न करें, कुचलें नहीं, मोड़ें नहीं और खोलें नहीं। "
        "इसे गर्मी और आग के स्रोतों से दूर रखें। सूजी हुई या क्षतिग्रस्त बैटरी "
        "को सामान्य कचरे से अलग रखें और अधिकृत बैटरी अपशिष्ट प्रबंधक से संपर्क करें।"
    ),
    "Broken glass": (
        "टूटी हुई स्क्रीन को सावधानी से संभालें। खुले काँच और अंदरूनी हिस्सों "
        "को सीधे न छुएँ। टूटे उपकरणों को संभालते समय कट-रोधी दस्ताने पहनें "
        "और काँच के नुकीले टुकड़ों को मजबूत, सुरक्षित डिब्बे में रखें।"
    ),
    "Personal data": (
        "पुनः उपयोग या रीसाइक्लिंग के लिए देने से पहले आवश्यक डेटा का बैकअप लें, "
        "अकाउंट से साइन आउट करें, SIM और मेमोरी कार्ड निकालें तथा संभव हो तो "
        "फैक्टरी रीसेट करें। पिछले मालिक की निजी जानकारी न देखें और न साझा करें।"
    ),
    "Electrical energy": (
        "उपकरण को संभालने से पहले चार्जर और सभी बाहरी उपकरणों को डिस्कनेक्ट करें। "
        "पावर अडैप्टर न खोलें और खुले विद्युत भागों को न छुएँ। क्षतिग्रस्त अडैप्टर "
        "और खुले तारों वाले उपकरणों का उपयोग बंद करें तथा योग्य व्यक्ति को सौंपें।"
    ),
    "Sharp components and data": (
        "धातु के नुकीले किनारों और टूटे डिस्प्ले से सावधान रहें। क्षतिग्रस्त "
        "उपकरण संभालते समय उपयुक्त दस्ताने पहनें। पुनः उपयोग या रीसाइक्लिंग "
        "से पहले संग्रहित डेटा सुरक्षित करें और जहाँ संभव हो निजी स्टोरेज मीडिया निकालें।"
    ),
    "Fire and thermal runaway": (
        "बैटरियों को कभी कुचलें, छेदें, शॉर्ट-सर्किट करें या जलाएँ नहीं। "
        "बैटरी के टर्मिनलों को धातु की वस्तुओं के संपर्क से बचाएँ। इन्हें गर्मी "
        "और ज्वलनशील पदार्थों से दूर रखें। गर्म, सूजी हुई, आवाज़ करने वाली या "
        "धुआँ छोड़ने वाली बैटरी को सामान्य कबाड़ की तरह न संभालें। आग या तत्काल "
        "खतरे की स्थिति में दूर हटें और आपातकालीन सहायता लें।"
    ),
    "Chemical leakage": (
        "बैटरी से निकले रसायनों को नंगे हाथों से न छुएँ और अज्ञात इलेक्ट्रोलाइट "
        "को स्वयं निष्क्रिय करने की कोशिश न करें। धुएँ को साँस में लेने से बचें "
        "और रिसाव को नालियों या मिट्टी तक पहुँचने से रोकें। क्षतिग्रस्त या रिसाव "
        "करने वाली बैटरी के लिए विशेषज्ञ सहायता लें।"
    ),
    "Improper disposal": (
        "बेकार बैटरियों को घरेलू कचरे या सामान्य रीसाइक्लिंग कबाड़ में न मिलाएँ। "
        "उन्हें अलग रखें और लागू बैटरी अपशिष्ट प्रबंधन नियमों के अनुसार उपयुक्त "
        "संग्रह केंद्र या रीसाइक्लिंग चैनल तक पहुँचाएँ।"
    ),
    "Electrical shock": (
        "तारों और चार्जर को छूने से पहले सुनिश्चित करें कि वे सभी बिजली स्रोतों "
        "से डिस्कनेक्ट हैं। क्षतिग्रस्त तार को सुरक्षित न मानें यदि उसमें बिजली "
        "हो सकती है। चालू उपकरण से जुड़े खुले तारों को न छुएँ।"
    ),
    "Cuts and entanglement": (
        "उलझे तारों को सावधानी से संभालें ताकि कटने, ठोकर लगने या उलझने का "
        "खतरा न हो। आवश्यकता के अनुसार उपयुक्त दस्ताने पहनें। ताँबा निकालने "
        "के लिए तारों की इंसुलेशन न जलाएँ; उन्हें उपयुक्त रीसाइक्लिंग केंद्र पर भेजें।"
    ),
    "Toxic fumes": (
        "अनौपचारिक तरीके से तारों की इंसुलेशन को जलाएँ, पिघलाएँ या रसायनों से "
        "न हटाएँ। इससे खतरनाक धुआँ निकल सकता है और पर्यावरण दूषित हो सकता है। "
        "उपयुक्त केंद्र पर सुरक्षित यांत्रिक प्रसंस्करण करवाएँ।"
    ),
    "Heavy metals and toxic substances": (
        "सर्किट बोर्ड को तोड़ने, पीसने, रगड़ने या जलाने से बचें। इलेक्ट्रॉनिक "
        "घटकों में सीसा, कैडमियम, पारा या अन्य खतरनाक पदार्थ हो सकते हैं। "
        "धूल बनने से रोकें और बोर्ड को उपयुक्त पंजीकृत रीसाइक्लिंग केंद्र पर भेजें।"
    ),
    "Sharp edges": (
        "जहाँ सुरक्षित हो, सर्किट बोर्ड को उसके किनारों से पकड़ें। नुकीले "
        "सोल्डर पिन, टूटे घटकों और धातु के टुकड़ों से सावधान रहें। क्षतिग्रस्त "
        "बोर्ड संभालते समय उपयुक्त सुरक्षात्मक दस्ताने और आँखों की सुरक्षा का "
        "उपयोग करें।"
    ),
    "Unsafe material recovery": (
        "कीमती धातुएँ निकालने के लिए खुले में जलाने, अनियंत्रित एसिड प्रक्रिया "
        "या बिना सुरक्षा के रासायनिक निष्कर्षण का उपयोग न करें। इनसे जहरीले "
        "पदार्थों का संपर्क हो सकता है और मिट्टी, हवा तथा पानी प्रदूषित हो सकते हैं। "
        "बोर्ड को उपयुक्त पंजीकृत रीसाइक्लर को दें।"
    ),
    "Sharp and moving parts": (
        "खुले ब्लेड, टूटा प्लास्टिक, नुकीली धातु की चादरों और चलने वाले हिस्सों "
        "से सावधान रहें। गर्म उपकरणों को छूने से पहले ठंडा होने दें। क्षतिग्रस्त "
        "या खोले गए उपकरणों को संभालते समय उपयुक्त सुरक्षा उपकरण पहनें।"
    ),
    "Hazardous components": (
        "सामग्री निकालने के लिए लैंप, डिस्प्ले या सीलबंद घटकों को न तोड़ें। "
        "कुछ उपकरणों में खतरनाक पदार्थ या ऐसे कैपेसिटर हो सकते हैं जिनमें "
        "बिजली जमा रहती है। क्षतिग्रस्त घटकों को यथासंभव साबुत रखें और योग्य "
        "व्यक्तियों को सौंपें।"
    ),
    "Refrigerants and pressurized systems": (
        "रेफ्रिजरेटर और एयर कंडीशनर की रेफ्रिजरेंट पाइप न काटें, गैस न छोड़ें "
        "और सीलबंद कूलिंग सिस्टम को न खोलें। रेफ्रिजरेंट को उपयुक्त उपकरणों "
        "का उपयोग करके प्रशिक्षित व्यक्ति से ही निकलवाएँ।"
    ),
    "Heavy lifting and crushing": (
        "उपकरण उठाने से पहले उसका वजन और स्थिरता जाँचें। उचित लिफ्टिंग उपकरण "
        "या पर्याप्त प्रशिक्षित लोगों की सहायता लें। उपकरण को स्थिर रखें और "
        "असुरक्षित उपकरण के नीचे हाथ या पैर न रखें।"
    ),
    "Hazardous internal components": (
        "CRT टेलीविजन के काँच, फ्लोरोसेंट लैंप या अन्य संभावित खतरनाक घटकों "
        "को न तोड़ें। पुराने उपकरणों में सीसा युक्त काँच, पारा युक्त लैंप या अन्य "
        "खतरनाक पदार्थ हो सकते हैं। क्षतिग्रस्त घटकों को सुरक्षित रखें और "
        "उपयुक्त रीसाइक्लिंग केंद्र को सौंपें।"
    ),
    "Unknown material": (
        "यदि वस्तु की सही पहचान नहीं हो पा रही है, तो उसे न खोलें और न उसके "
        "अंदरूनी हिस्सों को बाहर निकालें। उसकी पहचान और सुरक्षित निपटान का "
        "तरीका तय होने तक उसे सामान्य कचरे से अलग रखें।"
    ),
    "Unknown battery or chemical hazard": (
        "वस्तु को तोड़े बिना उसमें बैटरी, रिसता तरल, क्षतिग्रस्त कैपेसिटर, लैंप "
        "या अन्य संभावित खतरनाक घटकों की जाँच करें। यदि उसमें रिसाव हो, वह "
        "असामान्य रूप से गर्म हो, धुआँ निकले या तेज गंध आए, तो उससे दूर रहें "
        "और विशेषज्ञ या आपातकालीन सहायता लें।"
    ),
    "Unsafe disposal": (
        "अज्ञात इलेक्ट्रॉनिक कचरे को अनियंत्रित तरीके से न जलाएँ, न गाड़ें, "
        "न खुले में फेंकें और न ही खोलें। वस्तु की पहचान करें और उसे उपयुक्त "
        "संग्रह केंद्र, बैटरी अपशिष्ट चैनल या पंजीकृत ई-वेस्ट रीसाइक्लर तक पहुँचाएँ।"
    ),
}


def build_rows():
    """Merge English and Hindi into new dicts. Fails before touching the DB."""
    rows = []
    for g in SAFETY_GUIDELINES:
        key = (g["material_category"], g["hazard_type"])
        hindi = HINDI_TRANSLATIONS.get(g["hazard_type"])
        if hindi is None:
            raise ValueError(f"Missing Hindi translation: {key}")
        rows.append({**g, "rule_text": f"{g['rule_text']}\n\nहिंदी:\n{hindi}"})
    return rows


def reseed():
    rows = build_rows()  # validate everything first
    table = SafetyGuideline.__table__

    # One transaction: if anything fails, the old table is left untouched.
    with engine.begin() as conn:
        table.drop(conn, checkfirst=True)
        table.create(conn)

    with Session(engine) as session:
        for r in rows:
            session.add(SafetyGuideline(**r))
        session.commit()

    print(f"Reseeded {len(rows)} safety guidelines")

if __name__ == "__main__":
    reseed()