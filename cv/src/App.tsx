import { resume } from './data/resume';
import { Experience } from './components/Experience';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Projects } from './components/Projects';
import { Section } from './components/SectionTitle';
import { Sidebar } from './components/Sidebar';

/**
 * One A4 sheet (210 × 297 mm). On wide screens it renders as a fixed-size
 * paper preview; on narrow screens it reflows to a single column; in print
 * it is exactly one page with no margins.
 */
export function App() {
  return (
    <main className="mx-auto my-0 bg-white md:my-8 md:shadow-[0_10px_40px_-12px_rgb(15_39_71/0.25)] print:my-0 print:shadow-none md:h-[297mm] md:w-[210mm] print:h-[297mm] print:w-[210mm] flex flex-col overflow-hidden">
      <Header />
      <div className="grid flex-1 grid-cols-1 md:grid-cols-[35%_65%] print:grid-cols-[35%_65%]">
        <Sidebar />
        <div className="flex flex-col gap-[5mm] px-[7mm] py-[6mm]">
          <Section title="Professional Summary">
            <p className="text-[8.4pt] leading-[1.5] text-ink/85">{resume.summary}</p>
          </Section>
          <Experience />
          <Projects />
        </div>
      </div>
      <Footer />
    </main>
  );
}
