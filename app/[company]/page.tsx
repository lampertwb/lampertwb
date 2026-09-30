import Home from "../page";

export const dynamicParams = false;

export function generateStaticParams() {
  return ["newrelic", "runlayer", "levelai", "sequenai", "uscreen", "tldr", "sentra", "flosum", "unity"]
    .map((company) => ({ company }));
}

export default function CompanyPage() {
  return <Home />;
}