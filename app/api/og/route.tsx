import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

/**
 * Gera uma imagem Open Graph dinâmica baseada na seção Hero do portfólio.
 * A imagem é criada programaticamente usando @vercel/og e reflete o design
 * e conteúdo da seção Hero.
 *
 * @param {NextRequest} request - A requisição HTTP.
 * @returns {Promise<ImageResponse>} A imagem OG gerada.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parâmetros opcionais para personalização
    const title = searchParams.get('title') || 'Pedro Ernesto';
    const subtitle = searchParams.get('subtitle') || 'Desenvolvedor Full Stack';
    const intro = searchParams.get('intro') || 'Olá, eu sou';
    const theme = searchParams.get('theme') || 'light';

    // Cores baseadas no tema
    const colors = theme === 'dark' ? {
      background: '#0f172a',
      backgroundPattern: '#1e293b',
      overlay: 'linear-gradient(135deg, rgba(15,23,42,0.9) 0%, rgba(30,41,59,0.8) 100%)',
      intro: '#94a3b8',
      title: '#f8fafc',
      subtitle: '#64748b',
    } : {
      background: '#ffffff',
      backgroundPattern: 'lightgray',
      overlay: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(240,240,240,0.8) 100%)',
      intro: '#374151',
      title: '#111827',
      subtitle: '#6B7280',
    };

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.background,
            backgroundImage: `radial-gradient(circle at 25px 25px, ${colors.backgroundPattern} 2%, transparent 0%), radial-gradient(circle at 75px 75px, ${colors.backgroundPattern} 2%, transparent 0%)`,
            backgroundSize: '100px 100px',
            position: 'relative',
          }}
        >
          {/* Background overlay */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: colors.overlay,
            }}
          />
          
          {/* Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              zIndex: 10,
              padding: '40px',
            }}
          >
            {/* Intro text */}
            <div
              style={{
                fontSize: '32px',
                fontWeight: '600',
                color: colors.intro,
                marginBottom: '16px',
              }}
            >
              {intro}
            </div>
            
            {/* Main title */}
            <div
              style={{
                fontSize: '72px',
                fontWeight: '900',
                color: colors.title,
                marginBottom: '24px',
                letterSpacing: '-0.025em',
              }}
            >
              {title}.
            </div>
            
            {/* Subtitle */}
            <div
              style={{
                fontSize: '28px',
                fontWeight: '500',
                color: colors.subtitle,
                maxWidth: '600px',
              }}
            >
              {subtitle}
            </div>
          </div>
          
          {/* Decorative elements */}
          <div
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'linear-gradient(45deg, #3B82F6, #8B5CF6)',
              opacity: 0.6,
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '20px',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(45deg, #10B981, #3B82F6)',
              opacity: 0.4,
            }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`Failed to generate OG image: ${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
} 