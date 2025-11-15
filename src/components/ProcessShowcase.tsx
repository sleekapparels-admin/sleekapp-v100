import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// Knitwear process images
import knitwearKnittingFloor from "@/assets/factory/photorealistic-factory-floor-wide.webp";
import knitwearMachineCloseup from "@/assets/factory/photorealistic-worker-machine-operation.webp";
import knitwearLinking from "@/assets/factory/knitwear-linking.webp";
import knitwearFinishing from "@/assets/factory/photorealistic-finishing-packaging.webp";
import knitwearQualityControl from "@/assets/factory/photorealistic-quality-inspection.webp";

// Cut & Sew process images
import cutsewPatternCutting from "@/assets/factory/cutsew-pattern-cutting.webp";
import cutsewFabricCutting from "@/assets/factory/photorealistic-fabric-cutting.webp";
import cutsewSewingLine from "@/assets/factory/photorealistic-sewing-line.webp";
import cutsewFinishing from "@/assets/factory/cutsew-finishing.webp";
import cutsewInspection from "@/assets/factory/cutsew-inspection.webp";

// Woven/Uniform process images
import wovenFabricSourcing from "@/assets/factory/woven-fabric-sourcing.webp";
import wovenCutting from "@/assets/factory/woven-cutting.webp";
import wovenAssembly from "@/assets/factory/woven-assembly.webp";
import wovenPressing from "@/assets/factory/woven-pressing.webp";
import wovenQualityCheck from "@/assets/factory/woven-quality-check.webp";

export const ProcessShowcase = () => {
  const knitwearProcesses = [
    {
      title: "Automated Knitting",
      description: "Advanced flat-knit machines producing precision knitwear with AI-powered analytics for consistent quality.",
      image: knitwearKnittingFloor,
    },
    {
      title: "Pattern Creation",
      description: "Intricate patterns and multi-color designs created through state-of-the-art programming and yarn feeding systems.",
      image: knitwearMachineCloseup,
    },
    {
      title: "Linking & Assembly",
      description: "Skilled technicians assemble knitwear pieces with precision linking for seamless construction.",
      image: knitwearLinking,
    },
    {
      title: "Finishing & Pressing",
      description: "Professional finishing processes including steam pressing, washing, and final garment preparation.",
      image: knitwearFinishing,
    },
    {
      title: "Quality Control",
      description: "Rigorous AQL 2.5 inspection with detailed measurements and defect documentation for every piece.",
      image: knitwearQualityControl,
    },
  ];

  const cutsewProcesses = [
    {
      title: "Pattern Development",
      description: "CAD-based pattern design and grading for precise sizing across all garment specifications.",
      image: cutsewPatternCutting,
    },
    {
      title: "Precision Cutting",
      description: "Automated cutting systems slice through multiple fabric layers with millimeter accuracy.",
      image: cutsewFabricCutting,
    },
    {
      title: "Assembly Line",
      description: "Organized sewing lines with skilled operators assembling garments with consistent quality.",
      image: cutsewSewingLine,
    },
    {
      title: "Finishing",
      description: "Professional pressing, steaming, and final garment preparation for perfect presentation.",
      image: cutsewFinishing,
    },
    {
      title: "Final Inspection",
      description: "Comprehensive quality checks ensuring every garment meets international standards.",
      image: cutsewInspection,
    },
  ];

  const wovenProcesses = [
    {
      title: "Fabric Sourcing",
      description: "Careful selection and quality inspection of woven fabrics from trusted suppliers.",
      image: wovenFabricSourcing,
    },
    {
      title: "Pattern Cutting",
      description: "Precision cutting of woven shirt fabrics with optimal material utilization.",
      image: wovenCutting,
    },
    {
      title: "Shirt Assembly",
      description: "Specialized assembly lines for collars, cuffs, button attachments, and finishing details.",
      image: wovenAssembly,
    },
    {
      title: "Professional Pressing",
      description: "Industrial pressing and steaming for crisp, professional garment appearance.",
      image: wovenPressing,
    },
    {
      title: "Quality Assurance",
      description: "Final inspection verifying measurements, stitching quality, and overall finish.",
      image: wovenQualityCheck,
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Our Manufacturing Process
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            From concept to delivery—transparency at every stage of production for retailers and organizations.
          </p>
        </div>

        <Tabs defaultValue="knitwear" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8 sm:mb-12 h-auto">
            <TabsTrigger value="knitwear" className="text-xs sm:text-sm py-2">Knitwear</TabsTrigger>
            <TabsTrigger value="cutsew" className="text-xs sm:text-sm py-2">Cut & Sew</TabsTrigger>
            <TabsTrigger value="woven" className="text-xs sm:text-sm py-2">Uniforms</TabsTrigger>
          </TabsList>

          <TabsContent value="knitwear">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {knitwearProcesses.map((process, index) => (
                <Card
                  key={process.title}
                  className="overflow-hidden group hover:shadow-card-hover transition-all duration-300 border bg-card"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={process.image}
                      alt={process.title}
                      loading={index > 2 ? "lazy" : "eager"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      width="1536"
                      height="1024"
                    />
                  </div>
                  <div className="p-4 sm:p-6">
                    <h3 className="font-semibold text-base sm:text-lg mb-2">{process.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{process.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="cutsew">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {cutsewProcesses.map((process, index) => (
                <Card
                  key={process.title}
                  className="overflow-hidden group hover:shadow-card-hover transition-all duration-300 border bg-card"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={process.image}
                      alt={process.title}
                      loading={index > 2 ? "lazy" : "eager"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      width="1536"
                      height="1024"
                    />
                  </div>
                  <div className="p-4 sm:p-6">
                    <h3 className="font-semibold text-base sm:text-lg mb-2">{process.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{process.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="woven">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {wovenProcesses.map((process, index) => (
                <Card
                  key={process.title}
                  className="overflow-hidden group hover:shadow-card-hover transition-all duration-300 border bg-card"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={process.image}
                      alt={process.title}
                      loading={index > 2 ? "lazy" : "eager"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      width="1536"
                      height="1024"
                    />
                  </div>
                  <div className="p-4 sm:p-6">
                    <h3 className="font-semibold text-base sm:text-lg mb-2">{process.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{process.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};
