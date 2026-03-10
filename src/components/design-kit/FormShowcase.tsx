import { FormInput, FormTextarea, FormSelect } from "@/components/kit";

export function FormShowcase() {
  return (
    <div className="space-y-10 mt-4">
      {/* Dark theme */}
      <div>
        <span className="block mb-4 text-[10px] font-mono uppercase tracking-widest text-light-base/40">
          Dark Theme
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
          <FormInput label="Full Name" placeholder="John Doe" />
          <FormInput label="Email Address" placeholder="john@example.com" type="email" />
          <FormInput label="Phone" placeholder="(555) 123-4567" type="tel" />
          <FormSelect
            label="Service Needed"
            options={[
              { label: "Managed IT Support", value: "it" },
              { label: "Web Development", value: "web" },
              { label: "Digital Marketing", value: "marketing" },
            ]}
          />
          <div className="md:col-span-2">
            <FormTextarea label="Message" placeholder="Tell us about your project..." rows={4} />
          </div>
        </div>
      </div>

      {/* Light theme */}
      <div className="bg-light-base rounded-2xl p-8">
        <span className="block mb-4 text-[10px] font-mono uppercase tracking-widest text-dark-base/40">
          Light Theme
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
          <FormInput label="Full Name" placeholder="John Doe" theme="light" />
          <FormInput label="Email Address" placeholder="john@example.com" type="email" theme="light" />
          <div className="md:col-span-2">
            <FormTextarea label="Message" placeholder="Tell us about your project..." rows={4} theme="light" />
          </div>
        </div>
      </div>
    </div>
  );
}
