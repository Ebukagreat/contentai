export const PLANS = {
  starter: {
    name: 'Starter',
    price: 2500,
    priceLabel: '₦2,500/mo',
    credits: 50,
    features: ['50 AI credits/month', 'All 6 content types', 'Generation history', 'Email support'],
  },
  pro: {
    name: 'Pro',
    price: 6500,
    priceLabel: '₦6,500/mo',
    credits: 'Unlimited',
    features: ['Unlimited AI credits', 'All 6 content types', 'Priority generation', 'Priority support', 'API access (coming soon)'],
  },
}

export function openPaystackPayment({ email, plan, onSuccess, onClose }) {
  const planData = PLANS[plan]
  if (!planData) throw new Error('Invalid plan')

  const handler = window.PaystackPop.setup({
    key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    email,
    amount: planData.price * 100,
    currency: 'NGN',
    ref: `contentai_${plan}_${Date.now()}`,
    callback: (response) => onSuccess(response.reference, plan),
    onClose: () => onClose?.(),
  })
  handler.openIframe()
}
