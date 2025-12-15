const VAT_RATE = 0.19;
const DAYS_IN_YEAR = 365;

type BondValue = {
  insuredValue: number;
  rate: number;
  days: number;
};

export function getQuoteTotals(bondsValues: BondValue[]) {
  if (!bondsValues?.length) {
    return { premium: 0, vat: 0, total: 0 };
  }

  let premiumCents = 0;
  let vatCents = 0;

  for (const { insuredValue, rate, days } of bondsValues) {
    const rateAsDecimal = rate / 100;

    const bondPremiumCents = Math.round(
      ((insuredValue * rateAsDecimal) / DAYS_IN_YEAR) * days * 100,
    );
    const bondVatCents = Math.round(bondPremiumCents * VAT_RATE);

    premiumCents += bondPremiumCents;
    vatCents += bondVatCents;
  }

  const totalCents = premiumCents + vatCents;

  return {
    premium: premiumCents / 100,
    vat: vatCents / 100,
    total: totalCents / 100,
  };
}
