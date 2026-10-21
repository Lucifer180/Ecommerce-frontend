import { CallToAction } from "../components/CallToAction";
import { Hero } from "../components/Hero";
import { PopularSearches } from "../components/PopularSearches";
import { ValueProps } from "../components/ValueProps";

export default function LandingPage() {
    return (
        <>
            <Hero />
            <ValueProps />
            <PopularSearches />
            <CallToAction />
        </>
    );
}
