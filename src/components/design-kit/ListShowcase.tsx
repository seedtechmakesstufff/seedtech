import { CheckList, ResultList } from "@/components/kit";

export function ListShowcase() {
  return (
    <div className="space-y-10 mt-4">
      {/* CheckList */}
      <div>
        <span className="block mb-3 text-[10px] font-mono uppercase tracking-widest text-light-base/40">
          CheckList (1 column, dark)
        </span>
        <CheckList
          items={[
            "24/7 network monitoring & alerting",
            "Proactive patch management",
            "Dedicated account manager",
            "99.9% uptime SLA guarantee",
          ]}
        />
      </div>

      <div>
        <span className="block mb-3 text-[10px] font-mono uppercase tracking-widest text-light-base/40">
          CheckList (2 columns, dark)
        </span>
        <CheckList
          columns={2}
          items={[
            "Custom web applications",
            "E-commerce platforms",
            "SEO optimization",
            "Cloud migration",
            "Endpoint security",
            "Data backup & recovery",
          ]}
        />
      </div>

      {/* ResultList */}
      <div>
        <span className="block mb-3 text-[10px] font-mono uppercase tracking-widest text-light-base/40">
          ResultList
        </span>
        <ResultList
          items={[
            "40% reduction in IT support tickets",
            "99.9% uptime achieved in first quarter",
            "3x faster page load times",
            "45% increase in organic traffic",
          ]}
        />
      </div>
    </div>
  );
}
