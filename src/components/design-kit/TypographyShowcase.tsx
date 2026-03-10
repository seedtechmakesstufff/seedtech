import {
  Display, Title, Heading, HeadingLg, Subheading, CardTitle,
  Eyebrow, BodyLg, Body, BodySm, GradientText, StatNumber, StepNumber,
} from "@/components/kit";

export function TypographyShowcase() {
  const items: { label: string; el: React.ReactNode }[] = [
    { label: "Display (4.5rem)", el: <Display>Display Heading</Display> },
    { label: "Title (3.5rem)", el: <Title>Title Heading</Title> },
    { label: "HeadingLg (2.75rem)", el: <HeadingLg>Heading Large</HeadingLg> },
    { label: "Heading (2.25rem)", el: <Heading>Heading</Heading> },
    { label: "Subheading (1.5rem)", el: <Subheading>Subheading text here</Subheading> },
    { label: "CardTitle (1.125rem)", el: <CardTitle>Card Title</CardTitle> },
    { label: "Eyebrow (0.75rem)", el: <Eyebrow>Eyebrow Label</Eyebrow> },
    { label: "BodyLg (1.125rem)", el: <BodyLg>Body large paragraph text for descriptions.</BodyLg> },
    { label: "Body (1rem)", el: <Body>Standard body copy — the default paragraph text.</Body> },
    { label: "BodySm (0.875rem)", el: <BodySm>Small body text for captions and notes.</BodySm> },
    { label: "GradientText", el: <GradientText className="text-display font-display font-bold">Gradient Text</GradientText> },
    { label: "StatNumber (3.5rem)", el: <StatNumber>99.9%</StatNumber> },
    { label: "StepNumber (2.5rem)", el: <StepNumber>01</StepNumber> },
  ];

  return (
    <div className="space-y-8 mt-4">
      {items.map((item) => (
        <div key={item.label} className="border-b border-white/5 pb-6">
          <span className="block mb-2 text-[10px] font-mono uppercase tracking-widest text-light-base/40">
            {item.label}
          </span>
          {item.el}
        </div>
      ))}
    </div>
  );
}
