'use client';
import Link from 'next/link';
import '../styles/global.css';
import Image from 'next/image';
import { db } from '../firebase';
import Section from './components/section';
import { isShadeOfBlack } from './components/form';
import { useRef, useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { capitalizeAllWords, defaultContent, StateContext } from './home';

export default function RootLayout({ children, } : { children: React.ReactNode; }) {
  const mobileMenuBreakPoint = 697;

  let loaded = useRef(false);
  let [page, setPage] = useState(``);
  let [width, setWidth] = useState(0);
  let [color, setColor] = useState(``);
  let [dark, setDark] = useState(false);
  let [height, setHeight] = useState(0);
  let [updates, setUpdates] = useState(0);
  let [focus, setFocus] = useState(false);
  let [devEnv, setDevEnv] = useState(false);
  let [users, setUsers] = useState<any>([]);
  let [user, setUser] = useState<any>(null);
  let [highScore, setHighScore] = useState(0);
  let [colorPref, setColorPref] = useState(user);
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
    let storedUser = JSON.parse(localStorage.getItem(`user`) as any);
    setUpdates(updates);
    setPlatform(navigator?.userAgent);
    setYear(new Date().getFullYear());
    setPage(window.location.pathname.replace(`/`,``));
    setDevEnv(window.location.host.includes(`localhost`));
    
    if (storedUser) {
      setAuthState(`Sign Out`);
      getDocs(collection(db, `users`)).then((snapshot) => {
        let latestUsers = snapshot.docs.map((doc: any) => doc.data()).sort((a: any, b: any) => b?.highScore - a?.highScore);
        let latestUser = latestUsers.filter(usr => usr?.id == storedUser?.id)[0];
        setHighScore(Math.floor(latestUser?.highScore));
        setColor((latestUser?.color || `#000000`));
        setContent((latestUser?.bio || null));
        setUser(latestUser || null);
      });
    } 
    // else {
    //   // Remember Color
    //   let storedColor = JSON.parse(localStorage.getItem(`color`) as any) || 0;
    //   let storedHighScore = JSON.parse(localStorage.getItem(`highScore`) as any) || 0;
    //   colorPref && storedColor && setColor(storedColor);
    //   setHighScore(Math.floor(storedHighScore));
    // }
    
    windowEvents();

    window.addEventListener(`resize`, () => windowEvents());
    window.addEventListener(`scroll`, () => windowEvents());

    return () => {
      window.removeEventListener(`resize`, () => windowEvents());
      window.removeEventListener(`scroll`, () => windowEvents());
    }
  }, [user, users, authState, dark])

  return (
    <html lang="en" className={page}>
      <StateContext.Provider value={{ updates, setUpdates, content, setContent, width, setWidth, user, setUser, page, setPage, mobileMenu, setMobileMenu, users, setUsers, authState, setAuthState, emailField, setEmailField, devEnv, setDevEnv, mobileMenuBreakPoint, platform, setPlatform, focus, setFocus, highScore, setHighScore, color, setColor, dark, setDark, colorPref, setColorPref }}>
        <head>
          <title>Next.js 13 | Piratechs</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.css"></link>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet" />
          <script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js" defer></script>
        </head>
        <body className={`${page} ${colorPref ? (dark ? `dark` : `light`) : ``} ${isShadeOfBlack(color) ? `black` : ``}`} style={{background: color == `` ? `var(--mainTeal)` : colorPref ? color : `var(--mainTeal)`}}>
          <header>
            <nav className="inner">
              <Link className={`logo hoverLink`} href={`/`}>
                <Image className={`logo reactLogo`} priority src={`/react.svg`} alt={`Logo`} width={`50`} height={`50`} /> Home
              </Link>
              <ul className={`menu ${((platform as string)?.toLowerCase()?.includes(`mobile`) || (mobileMenu && width < mobileMenuBreakPoint)) ? `grid mobileNav` : width < mobileMenuBreakPoint ? `hide` : `show`}`}>
                {user && <li><Link className={`hoverLink`} href={`/profile`}>{capitalizeAllWords(user?.name?.split(` `)[0])}'s Profile</Link></li>}
                {/* <li><Link className={`hoverLink`} href={`/about`}>About</Link></li> */}
                {/* <li><Link className={`hoverLink`} href={`/projects`}>Projects</Link></li> */}
                <li><Link className={`hoverLink`} href={`/game`}>Game</Link></li>
                {/* <li><Link className={`hoverLink`} href={`/contact`}>Contact</Link></li> */}
              </ul>
              {((platform as string)?.toLowerCase()?.includes(`mobile`) || width < mobileMenuBreakPoint) && <div className="mobileMenu">
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
