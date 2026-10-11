# Kabadiwala Connect

**Photograph e-waste, get a fair price range, and agree a deal with an authorized recycler, in Hindi, on a phone.**

Built for the AWS Bharat Builds Tour Environmental Hacks (WeMakeDevs), Waste and Energy track.

- Live app: [https://main.dbidovmuqj3gr.amplifyapp.com/]
- Demo video: [VIDEO URL]
- Backend API docs: https://a7rrl45olio4npjxbkiuatnl7m0iyhdb.lambda-url.ap-southeast-2.on.aws/docs
- Team: [Scrapsync]

## The problem

Informal e-waste collectors (kabadiwalas) sell what they collect to whoever offers a price. They usually have no way to know what a fair price is, no guidance on the hazards of what they handle (lithium batteries, burnt cable insulation, circuit boards), and no record of the deal afterwards. The recycler sets the price, and the collector has nothing to compare it to.

## What it does

1. **Scan.** The collector takes a photo of a pile. AI detects the e-waste items and draws numbered boxes on the photo.
2. **Review.** The collector corrects the result: rename an item, change its category, or remove a wrong detection. The AI proposes and the human decides. Items cannot be added, so a bad detection can never silently change the price.
3. **Register.** The collector enters one weight per category and an address. The app creates a lot with an estimated price range and category-specific safety rules.
4. **Match.** Authorized recyclers that buy every category in the lot are listed, best price first, with distance shown for information.
5. **Offer and quote.** The collector sends the lot to one recycler. That recycler sees it in their own view and replies with a price.
6. **Agree.** The collector accepts. An audit record is created, showing the agreed price against the rate-card price and the percentage difference.

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