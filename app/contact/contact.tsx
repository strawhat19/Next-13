'use client';
import { useContext, useEffect } from 'react';
import { capitalizeAllWords, StateContext } from '../home';

export default function Contact() {
    const { state, setState, page, setPage } = useContext(StateContext);

    useEffect(() => {
      setState({ 
        ...state,
        updates: state.updates+1, 
        page: window.location.pathname.replace(`/`,``),
      });
      setPage(window.location.pathname.replace(`/`,``));
      console.log(`Contact`, state);
    }, [])

    return <div className={`inner`}>
        <h1>Contact</h1>
        <div className="column rightColumn">
            <h2>Clicks: {state.updates}</h2>
            <h2>State: {capitalizeAllWords(page)}</h2>
            <h2>State: {state.page == `` ? `Home` : capitalizeAllWords(state.page)}</h2>
        </div>
    </div>
}