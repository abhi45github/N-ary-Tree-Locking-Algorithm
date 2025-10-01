import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Play, Github } from "lucide-react";
import heroImage from "@/assets/hero-tree.jpg";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
        
        <div className="relative container mx-auto px-4 py-32">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Badge className="bg-primary/20 text-primary border-primary/30 mb-4">
              Tree of Space Practice
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-1000">
              N-ary Tree Locking Algorithm
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-150">
              Thread-safe locking and unlocking for N-ary trees with optimized performance
            </p>
            <div className="flex flex-wrap gap-3 justify-center animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
              <Badge variant="secondary" className="text-base px-4 py-2">C++</Badge>
              <Badge variant="secondary" className="text-base px-4 py-2">Multithreading</Badge>
              <Badge variant="secondary" className="text-base px-4 py-2">Lock-free</Badge>
            </div>
            <div className="flex gap-4 justify-center animate-in fade-in slide-in-from-bottom-7 duration-1000 delay-500 mt-8">
              <Button size="lg" onClick={() => navigate('/demo')} className="text-lg px-8 py-6">
                <Play className="w-5 h-5 mr-2" />
                Try Interactive Demo
              </Button>
              <Button size="lg" variant="outline" onClick={() => window.open('https://github.com/abhi45github/N-ary-Tree-Locking-Algorithm', '_blank')} className="text-lg px-8 py-6">
                <Github className="w-5 h-5 mr-2" />
                View on GitHub
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Key Achievements */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="p-8 bg-card border-border hover:shadow-[var(--shadow-glow)] transition-all duration-500 hover:scale-105">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-foreground">Thread-Safe</h3>
              <p className="text-muted-foreground">
                Implemented locking and unlocking mechanism without traditional mutex, ensuring safe concurrent access
              </p>
            </div>
          </Card>

          <Card className="p-8 bg-card border-border hover:shadow-[var(--shadow-glow)] transition-all duration-500 hover:scale-105">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-foreground">Optimized Performance</h3>
              <p className="text-muted-foreground">
                Advanced traversal algorithm reducing complexity from O(N) to O(log N) for superior efficiency
              </p>
            </div>
          </Card>

          <Card className="p-8 bg-card border-border hover:shadow-[var(--shadow-glow)] transition-all duration-500 hover:scale-105">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-foreground">N-ary Tree Structure</h3>
              <p className="text-muted-foreground">
                Flexible implementation supporting arbitrary branching factors in tree hierarchy
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Performance Comparison */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Performance Optimization
            </h2>
            <p className="text-xl text-muted-foreground">
              Significant complexity reduction through advanced traversal techniques
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 bg-card border-destructive/30">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-foreground">Before</h3>
                  <Badge variant="destructive" className="text-lg px-4 py-1">O(N)</Badge>
                </div>
                <div className="space-y-2">
                  <div className="h-2 bg-destructive/20 rounded-full">
                    <div className="h-full w-full bg-destructive rounded-full animate-pulse" />
                  </div>
                  <p className="text-sm text-muted-foreground">Linear time complexity</p>
                </div>
                <p className="text-muted-foreground">
                  Traditional approach requiring traversal of all nodes for lock validation
                </p>
              </div>
            </Card>

            <Card className="p-8 bg-card border-accent/30 shadow-[var(--shadow-glow)]">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-foreground">After</h3>
                  <Badge className="bg-accent/20 text-accent border-accent/30 text-lg px-4 py-1">O(log N)</Badge>
                </div>
                <div className="space-y-2">
                  <div className="h-2 bg-accent/20 rounded-full">
                    <div className="h-full w-[30%] bg-accent rounded-full" />
                  </div>
                  <p className="text-sm text-accent">Logarithmic time complexity</p>
                </div>
                <p className="text-muted-foreground">
                  Optimized traversal minimizing nodes checked during lock operations
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Technical Details */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <Card className="p-12 bg-gradient-to-br from-card to-card/50 border-border">
            <div className="space-y-8">
              <h2 className="text-4xl font-bold text-foreground">Technical Implementation</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-primary">Key Features</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">Lock-free synchronization without traditional mutex primitives</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">Efficient ancestor and descendant validation</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">Concurrent access management for multi-threaded environments</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">Optimized tree traversal algorithms</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-secondary">Technologies</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground"><strong>C++:</strong> Core implementation language</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground"><strong>Multithreading:</strong> Concurrent execution support</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground"><strong>Data Structures:</strong> N-ary tree implementation</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground"><strong>Algorithms:</strong> Advanced traversal optimization</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Results */}
      <section className="container mx-auto px-4 py-20 pb-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Implementation Results
          </h2>
          
          <Card className="p-12 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/30">
            <div className="space-y-6">
              <div className="text-7xl md:text-8xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                10/10
              </div>
              <p className="text-2xl font-semibold text-foreground">
                All Test Suites Passed
              </p>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Successfully passed all 10 comprehensive test suites including basic operations, constraints validation, multithreading stress tests, and performance benchmarks
              </p>

              <div className="pt-6 space-y-3">
                <div className="h-4 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-accent to-primary rounded-full transition-all duration-1000 ease-out"
                    style={{ width: '100%' }}
                  />
                </div>
                <p className="text-sm text-accent font-semibold">100% Success Rate - Production Ready</p>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
