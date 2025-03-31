
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { useApiContext } from "@/context/ApiContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { STRIPE_PRODUCT_ID } from "@/components/dashboard/sections/billing/utils/BillingUtils";
import { useLanguage } from "@/context/LanguageContext";

const PricingSection = () => {
  const { t } = useLanguage();
  const { isAuthenticated } = useApiContext();
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  const plans = [
    {
      name: t("basic_plan"),
      price: "49",
      description: t("basic_description"),
      features: [
        t("up_to_minutes").replace("{0}", "500"),
        t("voice_agents").replace("{0}", "2"),
        t("basic_integrations"),
        t("weekly_reports"),
        t("email_support")
      ],
      cta: t("start_free"),
      popular: false,
      priceId: "price_1R8Sl9LeoauYmYi0EO0IBI7a",
      productId: STRIPE_PRODUCT_ID
    },
    {
      name: t("pro_plan"),
      price: "149",
      description: t("pro_description"),
      features: [
        t("up_to_minutes").replace("{0}", "2.000"),
        t("voice_agents").replace("{0}", "5"),
        t("all_integrations"),
        t("advanced_reports"),
        t("human_transfer"),
        t("priority_support")
      ],
      cta: t("start_trial"),
      popular: true,
      priceId: "price_1R8Sl9LeoauYmYi0EO0IBI7a",
      productId: STRIPE_PRODUCT_ID
    },
    {
      name: t("enterprise_plan"),
      price: t("custom_price"),
      description: t("enterprise_description"),
      features: [
        t("unlimited_minutes"),
        t("unlimited_agents"),
        t("custom_integrations"),
        t("custom_voice"),
        t("dedicated_api"),
        t("support_24_7"),
        t("account_manager")
      ],
      cta: t("contact_sales_cta"),
      popular: false,
      priceId: "price_1R8Sl9LeoauYmYi0EO0IBI7a",
      productId: STRIPE_PRODUCT_ID
    }
  ];

  const handlePlanSelect = async (plan: typeof plans[0]) => {
    // For the Enterprise plan, simply redirect to contact
    if (plan.name === t("enterprise_plan")) {
      navigate("#contact");
      return;
    }

    // If the user is not authenticated, redirect to login
    if (!isAuthenticated) {
      // Save the selected plan in localStorage to retrieve it after login
      localStorage.setItem('selectedPlan', plan.priceId);
      toast.info(t("login_required"));
      navigate("/login");
      return;
    }

    try {
      setIsLoading(prev => ({ ...prev, [plan.priceId]: true }));
      
      // Call our edge function to create the checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          priceId: plan.priceId,
          planName: plan.name
        })
      });

      if (!response.ok) {
        throw new Error(t("payment_process_error"));
      }

      const { url } = await response.json();
      
      // Redirect to Stripe checkout page
      window.location.href = url;
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error(t("request_error"));
    } finally {
      setIsLoading(prev => ({ ...prev, [plan.priceId]: false }));
    }
  };

  return (
    <section id="pricing" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/20 to-white dark:from-indigo-950/10 dark:to-gray-950 -z-10"></div>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block px-3 py-1 text-sm font-medium text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-full mb-4"
          >
            {t("pricing")}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            {t("plans_title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            {t("plans_subtitle")}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`rounded-2xl border ${
                plan.popular 
                  ? "border-indigo-500 shadow-xl relative" 
                  : "border-gray-200 shadow-md"
              } bg-white dark:bg-gray-800 overflow-hidden`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0">
                  <div className="bg-indigo-600 text-white text-xs font-medium px-3 py-1 rounded-bl-lg">
                    {t("popular")}
                  </div>
                </div>
              )}
              <div className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {plan.price === t("custom_price") ? "" : "$"}
                    {plan.price}
                  </span>
                  {plan.price !== t("custom_price") && (
                    <span className="text-gray-600 dark:text-gray-400 ml-1">{t("per_month")}</span>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{plan.description}</p>
                <Button
                  variant={plan.popular ? "default" : "outline"}
                  className={`w-full mb-6 py-6 ${plan.popular ? "bg-indigo-600 hover:bg-indigo-700" : ""}`}
                  onClick={() => handlePlanSelect(plan)}
                  disabled={isLoading[plan.priceId]}
                >
                  {isLoading[plan.priceId] ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t("loading")}
                    </span>
                  ) : plan.cta}
                </Button>
                <ul className="space-y-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check className="w-5 h-5 text-indigo-600 mr-3 shrink-0 mt-0.5" />
                      <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 dark:text-gray-400">
            {t("custom_plan")} <a href="#contact" className="text-indigo-600 hover:underline font-medium">{t("contact_us")}</a>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
