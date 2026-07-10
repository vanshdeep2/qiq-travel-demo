/**
 * Altair Travel — conversation seeds for every L2 contact driver.
 * Used by generate-altair-dataset.mjs to build realistic B2C travel transcripts.
 * Placeholder: {booking} — e.g. AT-BK-12345
 */

export const DRIVER_ISSUE_TEMPLATES = {
  // ── Amendments & Cancellations ──────────────────────────────────────────────

  'Tour Date Change Request': {
    customerOpen:
      'I need to move the departure date on booking {booking} — my husband has a work commitment on the original week.',
    customerFollow:
      'We are on the Highlights of Tuscany escorted tour and ideally need the September departure instead of August.',
    agentFinding:
      'I can see your escorted package on {booking} with departure 14 August. Let me check availability on the later departure.',
    agentResolve:
      'I have moved you to the 18 September departure at no amendment fee. Your revised itinerary and ATOL certificate will arrive by email within the hour.',
  },

  'Cruise Cabin Upgrade': {
    customerOpen:
      'I would like to upgrade our cabin on booking {booking} from an inside to a balcony if there is availability.',
    customerFollow:
      'It is the Norwegian Fjords cruise — we are celebrating our anniversary and would love a sea view.',
    agentFinding:
      'I am checking live cabin inventory on {booking} for the MV Nordfjord sailing.',
    agentResolve:
      'A balcony cabin on Deck 7 is available. The upgrade is £420 per person and I have secured it on {booking}. Your balance invoice will reflect the difference.',
  },

  'Cancellation - Full': {
    customerOpen:
      'I need to cancel booking {booking} in full — unfortunately our travel plans have changed completely.',
    customerFollow:
      'We booked the escorted package six weeks ago and have not yet paid the final balance.',
    agentFinding:
      'I am reviewing the cancellation terms on {booking} and your payment history.',
    agentResolve:
      'You are within Altair Travel\'s 60-day penalty-free cancellation window, so there is no fee. I have cancelled {booking} and your £380 deposit will be refunded within 10 working days.',
  },

  'Cancellation - Partial Party': {
    customerOpen:
      'Two of our party need to drop off booking {booking} but the rest of us still want to travel.',
    customerFollow:
      'It is a group of six on the Greek Islands escorted tour — my parents cannot fly due to a medical issue.',
    agentFinding:
      'I can see six travellers on {booking}. Let me confirm the partial cancellation rules and whether the remaining four can keep the same cabin allocation.',
    agentResolve:
      'I have removed the two passengers from {booking} without affecting the rest of the party. A revised invoice showing the reduced balance of £2,400 will be emailed today.',
  },

  'Name Change on Booking': {
    customerOpen:
      'My name is spelled incorrectly on booking {booking} and I am worried it will not match my passport.',
    customerFollow:
      'It shows "Jon" instead of "John" on the flight segment and the cruise manifest.',
    agentFinding:
      'I can see the discrepancy on {booking} against the passport details you uploaded to My Altair.',
    agentResolve:
      'I have corrected the name to match your passport on {booking} and reissued the travel documentation. Please allow 24 hours for the airline and cruise line systems to update.',
  },

  'Penalty Waiver Request': {
    customerOpen:
      'I cancelled booking {booking} just outside the penalty-free window and I am asking for the £600 cancellation fee to be waived.',
    customerFollow:
      'My partner was hospitalised two days before we were due to pay the balance — I can provide a letter from the hospital.',
    agentFinding:
      'I can see the cancellation on {booking} was processed with a penalty charge. Let me review the supporting documents you submitted.',
    agentResolve:
      'Given the medical circumstances, I have submitted a penalty waiver request for {booking} to our customer relations team. You will receive a decision within 5 working days and I have noted the hospital letter on your case.',
  },

  'Departure Airport Change': {
    customerOpen:
      'I need to change the departure airport on booking {booking} from Manchester to London Heathrow.',
    customerFollow:
      'We have moved house and Manchester is no longer convenient for the outbound flight.',
    agentFinding:
      'I am checking whether the escorted package on {booking} can be re-routed via Heathrow without affecting the tour join point.',
    agentResolve:
      'Heathrow departures are available on the same date. The airport change on {booking} carries a £95 per person amendment fee, which I have applied. Your updated flight details will be in My Altair within 48 hours.',
  },

  'Dietary / Accessibility Amendment': {
    customerOpen:
      'I need to add a gluten-free meal request and a wheelchair-accessible cabin to booking {booking}.',
    customerFollow:
      'I did not realise I could specify dietary needs at the time of booking — the cruise is in six weeks.',
    agentFinding:
      'I can see no special requirements are currently noted on {booking}. Let me check with the cruise line and tour operator.',
    agentResolve:
      'Gluten-free meals are confirmed for all dining on board and I have allocated an accessible cabin on Deck 3. Both amendments are saved on {booking} and noted on your travel documents.',
  },

  // ── Bookings & Reservations ─────────────────────────────────────────────────

  'Escorted Tour Enquiry': {
    customerOpen:
      'I am interested in your escorted tour to Japan next spring — can you tell me what is included?',
    customerFollow:
      'We are looking at the 14-night package with the tour manager and wondering about the deposit.',
    agentFinding:
      'Let me pull up the Japan Discovery escorted package details and current availability for spring departures.',
    agentResolve:
      'The tour includes return flights, 4-star hotels, all breakfasts and six dinners, entrance fees, and a dedicated tour manager. A £500 deposit secures your place and the balance of £3,200 is due 60 days before departure. I can email the full brochure and ATOL-protected booking form today.',
  },

  'Cruise Availability': {
    customerOpen:
      'I want to check if there are any balcony cabins left on the Mediterranean cruise departing in October.',
    customerFollow:
      'We are a couple looking for a 10-night sailing — preferably with the Rome and Santorini excursions included.',
    agentFinding:
      'I am checking live availability across our Mediterranean cruise programme for October departures.',
    agentResolve:
      'There are two balcony cabins remaining on the 8 October sailing. The fare is £1,850 per person including the Rome and Santorini excursions. I can hold a cabin for 48 hours with no obligation while you decide.',
  },

  'Group Booking': {
    customerOpen:
      'I am organising a group of 14 for the Scottish Highlands escorted tour and need a group booking quote.',
    customerFollow:
      'We are a walking club and would ideally like adjoining rooms at the hotels where possible.',
    agentFinding:
      'Let me check group allocation and rooming options for 14 passengers on the Highlands departure.',
    agentResolve:
      'I can offer a group rate of £1,450 per person for 14 travellers, with adjoining rooms blocked at each hotel. A £200 per person deposit holds the allocation and the balance is due 60 days before departure. I will email the group booking form and ATOL certificate.',
  },

  'Solo Traveller Package': {
    customerOpen:
      'I am travelling alone and want to know if you have solo traveller places on the Portugal escorted tour.',
    customerFollow:
      'I would prefer not to pay a large single supplement if there is a sharing option.',
    agentFinding:
      'I am checking solo availability and single supplement options on the Portugal departures.',
    agentResolve:
      'We have a solo traveller place on the 22 May departure with a room-share option, reducing the single supplement to £295. The total package is £1,680 including flights, hotels, and the tour manager. I can reserve this for 48 hours on request.',
  },

  'Deposit & Payment Terms': {
    customerOpen:
      'I have booking {booking} and I want to confirm when the balance payment is due and how much I owe.',
    customerFollow:
      'I paid the £380 deposit when I booked but I am not sure about the final amount or deadline.',
    agentFinding:
      'Let me pull up the payment schedule on {booking}.',
    agentResolve:
      'On {booking} your balance of £1,200 is due by 15 July — that is 60 days before your departure date. You can pay via My Altair by card or bank transfer. I have emailed the payment schedule and your ATOL-protected booking confirmation.',
  },

  'Early Bird Offer': {
    customerOpen:
      'I saw the early bird offer on your website for the Croatia escorted tour — does it apply to booking {booking}?',
    customerFollow:
      'I booked last week and the promotion said book by the end of the month for £150 off per person.',
    agentFinding:
      'I am checking whether {booking} was confirmed within the early bird booking window.',
    agentResolve:
      'Your booking on {booking} qualifies for the early bird discount. I have applied £150 per person and your revised balance is £2,100. An updated invoice is in My Altair now.',
  },

  // ── Payments & Refunds ──────────────────────────────────────────────────────

  'Cancellation Refund Status': {
    customerOpen:
      'I cancelled booking {booking} three weeks ago and I still have not received my refund.',
    customerFollow:
      'I was told the £380 deposit would be back within 10 working days but nothing has appeared on my bank statement.',
    agentFinding:
      'I can see the cancellation was processed on {booking}. Let me trace the refund through our finance team.',
    agentResolve:
      'The refund of £380 was released on the 12th but your bank may take a further 5 working days to credit your account. I have raised a payment trace reference and you should see the funds by Friday. I have emailed confirmation.',
  },

  'Balance Payment Failure': {
    customerOpen:
      'My balance payment for booking {booking} keeps failing when I try to pay online.',
    customerFollow:
      'I have tried twice with my debit card and both times it says payment declined, but my bank says there is no issue.',
    agentFinding:
      'I can see two failed payment attempts on {booking} in the last 24 hours. Let me check the error codes from our payment provider.',
    agentResolve:
      'The failures were caused by a 3-D Secure timeout, not a card decline. I have cleared the failed attempts on {booking} so you will not be charged twice. Please try again via My Altair — use the link I have just emailed, which is valid for 72 hours.',
  },

  'Travel Insurance Query': {
    customerOpen:
      'I need to understand what travel insurance cover is included with booking {booking}.',
    customerFollow:
      'I want to know if I need to buy separate insurance or if the ATOL protection covers medical emergencies abroad.',
    agentFinding:
      'Let me review the insurance and financial protection details on {booking}.',
    agentResolve:
      'Your booking is ATOL protected, which covers you if Altair Travel ceases trading — but it is not a substitute for personal travel insurance. I recommend our partner policy at £49 per person, which covers medical, cancellation, and baggage. I have emailed a comparison sheet and you can add it to {booking} before your balance due date.',
  },

  'Penalty Fee Dispute': {
    customerOpen:
      'I was charged a £450 penalty on booking {booking} and I do not think it is correct.',
    customerFollow:
      'I cancelled 58 days before departure, which should be within the 60-day penalty-free window.',
    agentFinding:
      'I am reviewing the cancellation date against the departure date and penalty schedule on {booking}.',
    agentResolve:
      'You are correct — the cancellation was within the 60-day penalty-free window and the £450 charge was applied in error. I have reversed the penalty on {booking} and the full £380 deposit refund is being reprocessed. You will receive confirmation within 3 working days.',
  },

  // ── Pre-Travel Support ──────────────────────────────────────────────────────

  'Travel Documentation': {
    customerOpen:
      'I have not received my travel documents for booking {booking} and we depart in ten days.',
    customerFollow:
      'My Altair account still shows "documents pending" and I need the flight e-tickets and hotel vouchers.',
    agentFinding:
      'I can see your final balance cleared on {booking} but the document pack has not been dispatched yet.',
    agentResolve:
      'I have released your travel documents for {booking} now. Your e-tickets, hotel vouchers, excursion vouchers, and tour manager contact details are in My Altair and I have resent them to your email. Please check your spam folder if they do not arrive within the hour.',
  },

  'Itinerary Query': {
    customerOpen:
      'I have a question about the day-by-day itinerary on booking {booking} — specifically the free day in Florence.',
    customerFollow:
      'The brochure mentions a free day but I am not sure if any excursions are included or if we are on our own.',
    agentFinding:
      'Let me open the detailed itinerary for your escorted package on {booking}.',
    agentResolve:
      'Day 6 in Florence is a free day with no included excursions — your tour manager will suggest optional activities and help with restaurant bookings. Coach transfers to and from the hotel are included. I have emailed the full day-by-day itinerary for {booking}.',
  },

  'Visa & Documentation': {
    customerOpen:
      'I need advice on visa requirements for booking {booking} — we are visiting Turkey and Morocco on the same tour.',
    customerFollow:
      'I hold a UK passport but I am not sure if we need visas for either country.',
    agentFinding:
      'Let me check the entry requirements for each destination on your escorted itinerary for {booking}.',
    agentResolve:
      'UK passport holders do not need a visa for Turkey for stays under 90 days. Morocco requires an e-visa, which costs approximately £20 and takes 3–5 working days. I have emailed the official application links and a document checklist for {booking}. Apply at least four weeks before departure.',
  },

  'Transfer Arrangements': {
    customerOpen:
      'I need to confirm the airport transfer arrangements for booking {booking} — our flight lands at 22:40.',
    customerFollow:
      'I want to make sure someone will be at the airport when we arrive that late.',
    agentFinding:
      'I am checking the transfer schedule linked to your flight details on {booking}.',
    agentResolve:
      'Your arrival transfer on {booking} is confirmed — the Altair Travel representative will meet you in the arrivals hall with a name board. Late arrivals up to midnight are covered. I have updated the transfer manifest with your flight number and emailed the emergency contact number for the local office.',
  },

  // ── Post-Travel & Complaints ────────────────────────────────────────────────

  'Tour Manager Complaint': {
    customerOpen:
      'I want to complain about the tour manager on booking {booking} — our experience on the escorted tour was very disappointing.',
    customerFollow:
      'He was dismissive when we raised concerns about the coach being late and did not help with the missed excursion.',
    agentFinding:
      'I can see your escorted package on {booking} returned last week. Let me review the feedback notes from the tour operator.',
    agentResolve:
      'I am sorry to hear this. I have logged a formal complaint against the tour manager on {booking} and escalated it to our customer relations team. You will receive a written response within 10 working days, and I have noted your request for a goodwill gesture.',
  },

  'Accommodation Issue': {
    customerOpen:
      'The hotel on night three of booking {booking} was not the standard advertised — the room was dirty and the air conditioning did not work.',
    customerFollow:
      'We raised it with the tour manager on the night but nothing was done until we checked out.',
    agentFinding:
      'I am reviewing the hotel allocation and any incident reports filed during your escorted tour on {booking}.',
    agentResolve:
      'I have documented the accommodation issue on {booking} and contacted the hotel chain directly. I am arranging a partial refund of £120 for the affected night. You will receive a claims form by email and payment within 14 working days once processed.',
  },

  'Missed Excursion': {
    customerOpen:
      'We missed the Pompeii excursion on booking {booking} because the coach left 20 minutes early.',
    customerFollow:
      'We were in the hotel lobby at the scheduled time but the coach had already departed.',
    agentFinding:
      'I can see the excursion was on your itinerary for {booking}. Let me check the departure log from the tour operator.',
    agentResolve:
      'The operator has confirmed the coach departed early, which is not acceptable. I have credited the Pompeii excursion value of £65 per person to {booking} and offered a private tour alternative on your next Altair Travel booking. A formal apology letter is on its way.',
  },

  'Flight Disruption': {
    customerOpen:
      'Our outbound flight on booking {booking} was cancelled and we lost the first night of the cruise.',
    customerFollow:
      'The airline rebooked us for the next day but we missed the embarkation window and had to fly to the next port.',
    agentFinding:
      'I can see the flight disruption on {booking} and the revised embarkation arrangements made by our operations team.',
    agentResolve:
      'I have documented the disruption on {booking}. Altair Travel covered the additional transfer and port hotel as per our disruption policy. I am submitting a compensation claim for the lost cruise night — you should receive £180 per person within 21 working days.',
  },

  'Lost Luggage': {
    customerOpen:
      'My luggage did not arrive with my flight on booking {booking} and I had nothing for the first two days of the tour.',
    customerFollow:
      'The airline says it was located in Amsterdam but I had to buy essentials out of pocket.',
    agentFinding:
      'I can see your flight details on {booking} and the baggage claim reference you filed with the airline.',
    agentResolve:
      'I have noted the lost luggage incident on {booking}. Please keep all receipts for essential purchases — you can claim up to £150 per person through our post-travel claims team. I have emailed the claims form and the airline baggage reference to include with your submission.',
  },

  'Refund Post-Travel': {
    customerOpen:
      'I submitted a refund request after my trip on booking {booking} six weeks ago and I have heard nothing back.',
    customerFollow:
      'It was for the missed excursion and the hotel issue — I was told £185 would be refunded.',
    agentFinding:
      'Let me trace the post-travel refund claim on {booking} through our finance team.',
    agentResolve:
      'I can see your claim on {booking} was approved on the 3rd but the payment was held pending bank details confirmation. I have released the £185 refund today and it will reach your account within 5 working days. I have emailed payment confirmation.',
  },

  'ABTA/ATOL Query': {
    customerOpen:
      'I want to confirm that booking {booking} is ATOL protected before I pay the balance.',
    customerFollow:
      'A friend warned me to always check financial protection when booking package holidays.',
    agentFinding:
      'Let me verify the ATOL and ABTA protection status on {booking}.',
    agentResolve:
      'Booking {booking} is fully ATOL protected — licence number 11234. If Altair Travel ceased trading, you would be refunded or repatriated at no cost to you. Your ATOL certificate is in My Altair and I have resent it to your email. We are also ABTA members, which gives you access to their arbitration scheme.',
  },

  // ── Account & General ───────────────────────────────────────────────────────

  'Account & Login Issues': {
    customerOpen:
      'I cannot log into My Altair to view booking {booking} — it keeps saying my password is incorrect.',
    customerFollow:
      'I have tried the password reset twice but the emails are not arriving.',
    agentFinding:
      'I can see your account is active and the reset emails were sent to an old address ending in hotmail.co.uk.',
    agentResolve:
      'Your profile email was outdated. I have updated it to the address you confirmed and sent a fresh reset link. You should be able to access {booking} and your travel documents within 15 minutes.',
  },

  'Policy Clarification': {
    customerOpen:
      'I want to understand the cancellation policy before I commit to booking {booking}.',
    customerFollow:
      'The website mentions a 60-day penalty-free window but I am not sure what happens if I cancel closer to departure.',
    agentFinding:
      'Let me walk you through the cancellation terms that apply to your escorted package on {booking}.',
    agentResolve:
      'Altair Travel offers a 60-day penalty-free cancellation window from the date of booking — cancel before that point and you receive a full refund of your deposit. After 60 days, penalties apply on a sliding scale up to 100% within 14 days of departure. I have emailed the full policy summary for {booking}.',
  },

  'Follow-up Calls': {
    customerOpen:
      'I am calling back about booking {booking} — your colleague said my date change would be confirmed by yesterday.',
    customerFollow:
      'I have not received any email and I am getting nervous as the balance due date is approaching.',
    agentFinding:
      'I can see the prior case notes on {booking} and the pending amendment from your call on Tuesday.',
    agentResolve:
      'The date change on {booking} was approved this morning — my apologies for the delay. Your revised departure is 18 September and the updated itinerary is in My Altair now. I have confirmed the balance due date remains unchanged.',
  },

  'Feedback': {
    customerOpen:
      'I wanted to share feedback about our escorted tour on booking {booking} — overall it was wonderful.',
    customerFollow:
      'The tour manager was excellent and the hotels were lovely, though the coach on day four was quite cramped.',
    agentFinding:
      'Thank you for taking the time to share your experience on {booking}.',
    agentResolve:
      'I have recorded your feedback on {booking} and shared it with our product team and the tour operator. We really appreciate the kind words about the tour manager. A short survey will arrive by email if you would like to leave a review.',
  },
}
