# Kabadiwala Connect

**A kabadiwala photographs his scrap and sees what several authorized recyclers will pay for it, so he can sell to the best one.**

Built for the AWS Bharat Builds Tour Environmental Hacks (WeMakeDevs), Waste and Energy track.

- Live app: https://main.dbidovmuqj3gr.amplifyapp.com/
- Demo video: https://www.youtube.com/watch?v=D-zfJFgcR30
- Backend API docs: https://a7rrl45olio4npjxbkiuatnl7m0iyhdb.lambda-url.ap-southeast-2.on.aws/docs
- Team: Scrapsync

## Why would a collector use this?

**Because it can put more money in his hand.**

A collector does not choose a buyer for environmental reasons. He sells to the buyer he knows, at whatever price that buyer names, because he has nobody to compare against. With one buyer, the buyer sets the price.

Kabadiwala Connect gives him a choice. He photographs his scrap, enters the weight, and sees every authorized recycler that buys it, each with its price for his exact lot, best price first. He picks one and gets a written record of the agreed price.

In our demo data, one lot of circuit boards and cables is priced at ₹430, ₹396, ₹344 and ₹310 by four different recyclers, so the top offer is about 39% above the lowest. The rates are seeded demo data, not real market prices, but the mechanism is the point: when buyers compete for his scrap, the price goes up, and he does not need to understand regulations or the environment to benefit.

It costs him nothing to try. He needs a photo, a rough weight and an address, and he is free to sell to someone else if the offers are not good enough.

Along the way he also gets:
- **Authorized buyers.** Every recycler shows its authorization status.
- **A record of the deal.** The agreed price is written down next to the rate card price.
- **Safety rules in Hindi and English** for exactly what is in his lot, such as batteries or cable burning.

## The problem

India's informal e-waste collectors handle most of the country's collection but sit outside the formal EPR (Extended Producer Responsibility) recycling chain. About 78% of India's e-waste is processed by the informal sector (NITI Aayog and TERI, 2026). Informal processing recovers only 10 to 20% of the material, while formal facilities recover 95 to 97%. The rest is lost value, and informal methods such as burning cable insulation and acid-leaching circuit boards contaminate soil and water with heavy metals.

Collectors keep selling informally because those buyers are nearby and familiar, and the collector has no way to compare prices, find authorized recyclers, or keep a record of the deal. Livelihood decides where the material goes, so the formal route has to win on money first.

## Why this is also better for the environment

The collector chooses on price, and the price choice moves the material to the right place.

- Every recycler in the app is authorized, so a lot that goes through the app ends up at an authorized facility and not an informal one.
- Authorized facilities operate under CPCB authorization with environmental conditions, and recover 95 to 97% of the material, against 10 to 20% informally. A facility that recovers more from the same lot can afford to pay more for it. That is our reasoning, and we have not measured it.
- The collector does not have to care about any of this. The money brings him in, and the environmental benefit comes with the sale.

We do not measure how much material the app diverts. The claim is about direction: each deal moves a lot from the informal chain to the formal one.

## How the app answers it

| Gap | What the app does |
| --- | --- |
| No price transparency | Estimated price range from the photo and weights, then every eligible recycler's price with a per-category breakdown, best price first. |
| Does not know who is authorized | Lists recyclers that buy every category in the lot, with authorization status and location. |
| Distance and convenience | Address typed once. Road distance is shown beside each price, so he can weigh a farther buyer against a better price. |
| No record of the deal | On agreement, an audit record stores the lot, recycler, weights, rate card price, agreed price and the difference as a percentage. |
| Unsafe handling | Safety rules per category in Hindi and English, with the CPCB or E-Waste Rules source reference. |
| Language and literacy | Hindi by default with an English toggle, one main action per screen, large text, high contrast, and an icon beside every category. |

## How it works

1. **Scan.** He takes a photo. AI detects the items and draws numbered boxes.
2. **Review.** He renames, recategorises or removes items. He cannot add any, so a wrong detection can never raise the price.
3. **Register.** He enters one weight per category and an address, and gets a price range and safety rules.
4. **Match.** Authorized recyclers are listed, best price first, with distance shown.
5. **Offer and quote.** He sends the lot to one recycler, who replies with a price in their own view.
6. **Agree.** He accepts, and a deal record is created.

## Architecture

```
Phone browser (plain HTML/CSS/JS, hosted on AWS Amplify)
        |
        | HTTPS
        v
AWS Lambda Function URL  ->  FastAPI app (via Mangum)
        |            |             |              |
        v            v             v              v
   Amazon RDS    Amazon S3    Gemini API    OpenRouteService
   (PostgreSQL)  (photos,     (item         (address to
                 presigned    detection)    coordinates,
                 URLs)                      road distance)
```

Everything runs in `ap-southeast-2` (Sydney) and is deployed with AWS SAM.

## How AWS is used

| Service | Role |
| --- | --- |
| AWS Lambda + Function URL | Hosts the whole FastAPI backend as one serverless function (Python 3.13, Mangum adapter). No servers to run, and it costs nothing when idle. |
| Amazon RDS (PostgreSQL) | Stores lots, recyclers, rate cards, safety guidelines and audit records. |
| Amazon S3 | Stores lot photos. The API returns short-lived presigned URLs, and the database stores only the object key. |
| AWS Amplify Hosting | Serves the static frontend over HTTPS. |
| AWS SAM / CloudFormation | The whole backend (function, URL, IAM policy, environment) is defined in `template.yaml` and deployed with `sam deploy`. |

## AI and external services

- **Item detection:** Gemini (`gemini-3.1-flash-lite` first, falling back to `gemini-3.8-flash`) is asked for structured JSON with a name, a category from our fixed list, and a bounding box for each item. The response is validated, categories are normalised, and invalid items are dropped individually. If both models fail, the API returns 502 and the app shows a retry. We chose the lighter model first for speed (roughly 10 to 15 seconds against 17 to 30 seconds on the larger one in our tests).
- **Geocoding and distance:** OpenRouteService converts the typed address to coordinates and computes road distance to recyclers, falling back to straight-line distance if it is unavailable. The app marks approximate distances as such.

## Design decisions

The target user may read little English, uses an inexpensive phone, and has no way to check a price. So:

- **Hindi by default**, with an English toggle.
- **One main action per screen**, as a full-width button.
- **Large text, high contrast, 56px touch targets**, and a category icon beside every label.
- **The price range is the largest text** on the lot screen.
- **Numbered boxes on the photo matched to numbered cards**, so no information depends on colour alone.
- **Safety rules appear on every lot** in Hindi and English, sourced from CPCB guidance and the E-Waste (Management) Rules, 2022, with the source reference shown.
- **Ranking is by price only.** Distance is shown beside each offer, and the collector decides whether a farther recycler is worth it.
- **The receipt shows the agreed price against the rate card**, so the deal is written down.

## API overview

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/identify` | Photo in, detected items with boxes out. Creates nothing. |
| POST | `/lots` | Create a lot from the photo, categories with weights, and an address. |
| GET | `/lots`, `/lots/{uuid}` | List and read lots. |
| GET | `/lots/{uuid}/recyclers` | Eligible recyclers, best price first, paginated, with distance. |
| POST | `/lots/{uuid}/offer` | Send the lot to one recycler. |
| POST | `/lots/{uuid}/withdraw` | Take the offer back. |
| POST | `/lots/{uuid}/quote` | The recycler replies with a price. |
| POST | `/lots/{uuid}/agree` | The collector accepts, and an audit record is created. |
| GET | `/audits/{uuid}` | Read the deal record. |
| GET | `/recyclers`, `/recyclers/{id}/offers` | Recycler view. |
| GET | `/categories`, `/health`, `/health/db` | Reference data and health checks. |

A lot moves through `created`, `offered`, `quoted` and `closed`. A call made in the wrong state returns 409.

## Running it yourself

Backend:

```bash
pip install -r requirements.txt
# set GEMINI_API_KEY, ORS_API_KEY, DB_HOST, DB_NAME, DB_USER, DB_PASSWORD, DB_PORT,
# S3_BUCKET_NAME, S3_REGION in a .env file
uvicorn app.backend.main:app --reload
```

Deploy:

```bash
sam build
sam deploy --guided
```

Frontend: set the backend URL in `config.js`, then serve the folder, for example `python -m http.server 5500`.

## Limitations

We want to be clear about what this is and is not.

- **Demo recyclers.** The recycler list, authorization details and rates are seeded demo data, not real businesses.
- **Prices are rate-card estimates**, computed from weight times a per-kg rate. They are not live market prices.
- **No user testing.** We designed for the target user from accessibility principles and checked the layout on a phone-sized screen, but we have not tested it with real collectors.
- **No login.** One fixed demo collector, and the recycler tab is a picker. There is no authentication in this prototype.
- **Detection misses items in dense piles.** The AI finds the clear items and misses many in a heavy pile. Price depends on the weight the collector enters, not on the count of detected items.
- **Hindi is AI-assisted** and has not been reviewed by a professional translator. Item names from the AI stay in English, and official source references stay in English.
- **Ranking ignores distance.** The best price can belong to a far recycler, and the collector sees the distance and decides.
- **Safety text is a summary of CPCB guidance.** Where a rule comes from supplementary handling guidance and not a specific section of the rules, the source reference says so. It is not a legal or professional safety instruction.

## Next steps

- Rank by net value after transport cost.
- Real recycler onboarding and live rates.
- Collector and recycler authentication.
- Review of the Hindi text and safety content by a native speaker and a safety professional, and field testing with real collectors.
- Voice guidance for users who cannot read.

## Source

NITI Aayog and TERI, *Advancing Circular Economy of Waste Electronic and Electrical Equipment (E-waste) and Lithium-Ion Batteries in India* (January 2026): https://www.niti.gov.in/node/2108