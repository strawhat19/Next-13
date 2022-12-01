'use client';
import { useContext, useEffect } from 'react';
import { capitalizeAllWords, StateContext } from '../home';

export default function Projects() {
    const { state, setState } = useContext(StateContext);

    useEffect(() => {
      setState({ 
        ...state,
        updates: state.updates++, 
        page: window.location.pathname.replace(`/`,``),
      });
      console.log(`Projects`, state);
    }, [])

    return <div className={`inner`}>
        <h1>Projects</h1>
        <div className="column rightColumn">
            <h2>Clicks: {state.updates}</h2>
            <h2>Env: {state.devEnv ? `Dev` : `Prod`}</h2>
            <h2>State: {state.page == `` ? `Home` : capitalizeAllWords(state.page)}</h2>
        </div>
    </div>
}