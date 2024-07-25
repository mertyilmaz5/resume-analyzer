import React from 'react';
import { trefoil } from 'ldrs'

trefoil.register()

const styles = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
    backgroundColor: '#303030',
};

const Loader = () => {
    return (
        <div style={styles}>
            <l-trefoil
                size="150"
                stroke="5"
                stroke-length="0.1"
                bg-opacity="0.1"
                speed="5.0"
                color="white"
            ></l-trefoil>
            <h2 style={{ marginLeft: '20px', color: 'white' }}>Please wait for analyze report...</h2>
        </div>

    );
};

export default Loader;
