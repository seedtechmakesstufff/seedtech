import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { FormInput, FormTextarea, FormSelect, Button } from "@/components/kit";

export default function ContactPage() {
  return (
    <div className="pt-20">
      <Section>
        <SectionHeader
          eyebrow="Contact"
          title="Let's"
          titleHighlight="Talk"
          description="Tell us about your project or IT challenge, and we'll get back to you within one business day."
        />

        <form className="mx-auto max-w-2xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput label="Full Name" placeholder="John Doe" />
            <FormInput label="Email Address" placeholder="john@example.com" type="email" />
            <FormInput label="Company" placeholder="Acme Inc." />
            <FormSelect
              label="Service Interested In"
              options={[
                { label: "Managed IT Support", value: "it" },
                { label: "Web Development", value: "web" },
                { label: "Digital Marketing", value: "marketing" },
                { label: "Not sure yet", value: "unsure" },
              ]}
            />
          </div>
          <FormTextarea label="Tell Us About Your Project" placeholder="What challenges are you facing?" rows={6} />
          <div className="text-center pt-2">
            <Button variant="primary" size="lg" icon="send" type="submit">
              Send Message
            </Button>
          </div>
        </form>
      </Section>
    </div>
  );
}
