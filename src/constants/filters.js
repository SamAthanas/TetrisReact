export function GlitchRaw() {
    return ( 
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" style = {{display:"none"}}>
            <defs>
                <filter id="glitch" x="0" y="0">
                    <feColorMatrix in="SourceGraphic" mode="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r" />
                    <feOffset in="r" result="r" dx="-5">
                    <animate attributeName="dx" attributeType="XML" values="0; -5; 0; -18; -2; -4; 0 ;-3; 0" dur="0.2s" repeatCount="indefinite"/>
                    </feOffset>
                    <feColorMatrix in="SourceGraphic" mode="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="g"/>
                    <feOffset in="g" result="g" dx="-5" dy="1">
                    <animate attributeName="dx" attributeType="XML" values="0; 0; 0; -3; 0; 8; 0 ;-1; 0" dur="0.15s" repeatCount="indefinite"/>
                    </feOffset>
                    <feColorMatrix in="SourceGraphic" mode="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="b"/>
                    <feOffset in="b" result="b" dx="5" dy="2">
                    <animate attributeName="dx" attributeType="XML" values="0; 3; -1; 4; 0; 2; 0 ;18; 0" dur="0.35s" repeatCount="indefinite"/>
                    </feOffset>
                    <feBlend in="r" in2="g" mode="screen" result="blend" />
                    <feBlend in="blend" in2="b" mode="screen" result="blend" />
                </filter>
            </defs>
        </svg>
    );
}