
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

    

def seed_safety_guidelines(engine):
    with Session(engine) as session:
        # Avoid inserting duplicates when the seed script is rerun.
        existing = session.exec(
            select(SafetyGuideline)
        ).all()

        existing_keys = {
            (
                row.material_category,
                row.hazard_type,
            )
            for row in existing
        }

        inserted = 0

        for item in SAFETY_GUIDELINES:
            key = (
                item["material_category"],
                item["hazard_type"],
            )

            if key in existing_keys:
                continue

            session.add(SafetyGuideline(**item))
            existing_keys.add(key)
            inserted += 1

        session.commit()
        print(f"Inserted {inserted} safety guidelines.")
if __name__ == "__main__":
    seed_safety_guidelines(engine)

