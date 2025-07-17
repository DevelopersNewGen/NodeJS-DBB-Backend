const generateAccountNumber = () => {
    const countryCode = 'GT';
    const digitVerifier = '00';
    
    const bankCodes = ['BAMX', 'BAGR', 'BACR', 'BVGT'];
    const bankCode = bankCodes[Math.floor(Math.random() * bankCodes.length)];
    
    const currencyCode = 'Q';
    
    const productCodes = ['AH', 'CC', 'CA', 'PL'];
    const productCode = productCodes[Math.floor(Math.random() * productCodes.length)];   

    const accountNumber = Array.from({length: 16}, () => 
        Math.floor(Math.random() * 10)).join('');
    
    return `${countryCode}${digitVerifier}${bankCode}${currencyCode}${productCode}${accountNumber}`;
};

export default generateAccountNumber;