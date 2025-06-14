import React from 'react';
import { motion } from 'framer-motion';
import { 
  Code2, 
  FileCode, 
  Globe, 
  Palette, 
  Atom, 
  Server, 
  Zap, 
  Database, 
  GitBranch, 
  BookOpen 
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

// --- Componentes de UI (simulados para manter o estilo) ---

const Badge = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { variant?: string }) => (
  <div
    className={("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 " + className).replace(' border ', ' ')}
    {...props}
  />
);

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={("flex flex-col rounded-lg border bg-card text-card-foreground shadow-sm " + className)}
      {...props}
    />
  ),
);
Card.displayName = "Card";


interface Technology {
  id: string;
  name: string;
  icon: React.ReactNode;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

interface StacksProps {
  title?: string;
  subtitle?: string;
}

const Stacks: React.FC<StacksProps> = ({
  title,
  subtitle
}) => {
  const { t } = useLanguage();
  const technologies: Technology[] = [
    {
      id: 'javascript',
      name: 'JavaScript',
      icon: <Code2 className="w-8 h-8" />,
      level: 'Advanced',
    },
    {
      id: 'typescript',
      name: 'TypeScript',
      icon: <FileCode className="w-8 h-8" />,
      level: 'Advanced',
    },
    {
      id: 'html',
      name: 'HTML',
      icon: <Globe className="w-8 h-8" />,
      level: 'Expert',
    },
    {
      id: 'css',
      name: 'CSS',
      icon: <Palette className="w-8 h-8" />,
      level: 'Advanced',
    },
    {
      id: 'react',
      name: 'React',
      icon: <Atom className="w-8 h-8" />,
      level: 'Advanced',
    },
    {
      id: 'nodejs',
      name: 'Node.js',
      icon: <Server className="w-8 h-8" />,
      level: 'Advanced',
    },
    {
      id: 'nextjs',
      name: 'Next.js',
      icon: <Zap className="w-8 h-8" />,
      level: 'Intermediate',
    },
    {
      id: 'expressjs',
      name: 'Express.js',
      icon: <Server className="w-8 h-8" />,
      level: 'Intermediate',
    },
    {
      id: 'postgresql',
      name: 'PostgreSQL',
      icon: <Database className="w-8 h-8" />,
      level: 'Intermediate',
    },
    {
      id: 'git',
      name: 'Git/GitHub',
      icon: <GitBranch className="w-8 h-8" />,
      level: 'Advanced',
    },
    {
      id: 'notion',
      name: 'Notion',
      icon: <BookOpen className="w-8 h-8" />,
      level: 'Advanced',
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4
      }
    }
  };

  return (
    <section id="stacks" className="py-24 px-4 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">{title || t('stacks.title')}</h2>
          <p className="text-lg text-primary/80 dark:text-primaryDark/80 max-w-2xl mx-auto">
            {subtitle || t('stacks.subtitle')}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {technologies.map((tech) => (
            <motion.div
              key={tech.id}
              variants={itemVariants}
              className="h-full"
            >
              <Card className="p-6 h-full bg-cardLight dark:bg-card/50 border-borderLight dark:border-border backdrop-blur-sm hover:border-primary/50 dark:hover:border-primary/50 hover:-translate-y-2 transition-all duration-300 cursor-pointer group">
                <div className="flex flex-col items-center justify-center text-center space-y-4 h-full">
                  <motion.div
                    className="text-primary dark:text-primaryDark"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {tech.icon}
                  </motion.div>
                  
                  <div className="flex-grow flex items-center justify-center">
                    <h3 className="text-xl font-semibold">
                      {tech.name}
                    </h3>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Stacks;