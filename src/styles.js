import { injectGlobal }         from 'styled-components';

injectGlobal`
    *:not(i) {
        font-family: Oswald;
    }
    input {
        font-family: Oswald !important;
        letter-spacing: 1px;
    }
    .header, h1,h2,h3,h4,h5,h6 {
        font-family: Lato !important;
        letter-spacing: 1px !important;
    }
    main#admin-layout {
        background-color: #EFF0F4 !important;
        min-height: 100vh;
        padding-bottom: 50px;
    }
    .ui.modal{
        top: auto;
        left: auto;
    } 
`;