'use client';
import Link from 'next/link';
import '../styles/global.css';
import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';
import { capitalizeAllWords, defaultContent, StateContext } from './home';
import Section from './components/section';

export default function RootLayout({ children, } : { children: React.ReactNode; }) {
  const mobileMenuBreakPoint = 697;

  let loaded = useRef(false);
  let [page, setPage] = useState(``);
  let [width, setWidth] = useState(0);
  let [height, setHeight] = useState(0);
  let [updates, setUpdates] = useState(0);
  let [devEnv, setDevEnv] = useState(false);
  let [users, setUsers] = useState<any>([]);
  let [user, setUser] = useState<any>(null);
  let [authState, setAuthState] = useState(`Next`);
  let [mobileMenu, setMobileMenu] = useState(false);
  let [platform, setPlatform] = useState<any>(null);
  let [content, setContent] = useState(defaultContent);
  let [emailField, setEmailField] = useState<any>(false);
  let [year, setYear] = useState(new Date().getFullYear());

  const toggleMobileMenu = (e: any) => {
    setMobileMenu(!mobileMenu);
  }

  const windowEvents = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };
  
  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    setUpdates(updates);
    console.log(navigator);
    setPlatform(navigator?.userAgent);
    setYear(new Date().getFullYear());
    setPage(window.location.pathname.replace(`/`,``));
    setDevEnv(window.location.host.includes(`localhost`));
    
    if (JSON.parse(localStorage.getItem(`user`) as any)) {
      setUser(JSON.parse(localStorage.getItem(`user`) as any) || null);
      setAuthState(`Sign Out`);
      setContent((JSON.parse(localStorage.getItem(`user`) as any)?.bio || null));
    }
    
    windowEvents();

    window.addEventListener(`resize`, () => windowEvents());
    window.addEventListener(`scroll`, () => windowEvents());

    return () => {
      window.removeEventListener(`resize`, () => windowEvents());
      window.removeEventListener(`scroll`, () => windowEvents());
    }
  }, [])

  return (
    <html lang="en">
      <StateContext.Provider value={{ updates, setUpdates, content, setContent, width, setWidth, user, setUser, page, setPage, mobileMenu, setMobileMenu, users, setUsers, authState, setAuthState, emailField, setEmailField, devEnv, setDevEnv, mobileMenuBreakPoint, platform, setPlatform}}>
        <head>
          <title>Next.js 13 | Piratechs</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.css"></link>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet" />
        </head>
        <body className={page}>
          <header>
            <nav className="inner">
              <Link className={`logo hoverLink`} href={`/`}>
                <Image className={`logo reactLogo`} priority src={`/react.svg`} alt={`Logo`} width={`50`} height={`50`} /> Home
              </Link>
              <ul className={`menu ${((platform as string)?.includes(`mobile`) || (mobileMenu && width < mobileMenuBreakPoint)) ? `grid mobileNav` : width < mobileMenuBreakPoint ? `hide` : `show`}`}>
                {user && <li><Link className={`hoverLink`} href={`/profile`}>{capitalizeAllWords(user?.email?.split(`@`)[0])}</Link></li>}
                <li><Link className={`hoverLink`} href={`/about`}>About</Link></li>
                <li><Link className={`hoverLink`} href={`/projects`}>Projects</Link></li>
                <li><Link className={`hoverLink`} href={`/contact`}>Contact</Link></li>
              </ul>
              {((platform as string)?.includes(`mobile`) || width < mobileMenuBreakPoint) && <div className="mobileMenu">
                <div id="menuToggle" onClick={toggleMobileMenu}> Menu |
                  <a id="openMenuToggler" className={mobileMenu ? `openMenuToggler clicked` : `openMenuToggler`}>
                      <span id="menuTogglerSpan" className="menuTogglerSpan"></span>
                      <span id="menuTogglerSpan" className="menuTogglerSpan"></span>
                      <span id="menuTogglerSpan" className="menuTogglerSpan"></span>
                  </a>
                </div>
              </div>}
            </nav>
          </header>
          <main className={page}>{children}</main>
          <Section>{platform}</Section>
          {page != `profile` && <footer>
            <div className="inner">
              <div className="left">
                  <a href="https://github.com/strawhat19" target="_blank" className="hoverLink" title="GitHub"><i className="fab fa-github"></i> | Rakib Ahmed</a> 
                  <span className="vertical-sep">|</span>
                  <Link className={`hoverLink`} href={`/`}>Home  <i className="fas fa-undo"></i></Link>
              </div>
              <div className="right">Copyright <i className="fas fa-copyright"></i> 
                {year}
              </div>
            </div>
          </footer>}
        </body>
      </StateContext.Provider>
    </html>
  );
}
