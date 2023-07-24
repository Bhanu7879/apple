let jwtToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJQYXlGYWJyaWNfVjMiLCJpYXQiOiIxNjg1OTUyNTU0IiwiZXhwIjoiMTY4NTk1MzQ1NCIsImF1ZCI6IlBheW1lbnRQYWdlIiwic3ViIjoiMjMwNjA1MDMwOTgwOTQiLCJpbnN0IjoiYzk3MmZkZGEtYjY3Mi00NmYzLWFiZjMtYjE5YzBiYzIyYjg1IiwiZGV2aWNlIjoiM2ZmZGFhNTYtYmE3Zi00MTU2LTgxODUtYzkzZmNiMGJhNzdmIiwiZGNuIjoiMiIsInN1cHBvcnRlZFBheW1lbnRNZXRob2RzIjpbeyJ0eXBlIjoiQ3JlZGl0Q2FyZCIsInNyYyI6IlVSTCIsImF0dHJpYnV0ZXMiOm51bGx9LHsidHlwZSI6IkFQUExFUEFZIiwic3JjIjoiaHR0cHM6Ly9hcHBsZXBheS5jZG4tYXBwbGUuY29tL2pzYXBpL3YxL2FwcGxlLXBheS1zZGsuanMiLCJhdHRyaWJ1dGVzIjpbeyJrZXkiOiJtZXJjaGFudGlkZW50aWZpZXIiLCJ2YWx1ZSI6ImM5NzJmZGRhLWI2NzItNDZmMy1hYmYzLWIxOWMwYmMyMmI4NSIsInR5cGUiOiJjb25maWcifV19XX0.kT-ZA67KrPsel26Py6PNuoTfcL1C9KJf5I6vnX9f1f8';
let payfabricpaymentssdk;
let uniquePaymentsDivId=document.getElementById('uniquePaymentsDivId');
function loadPaymentsSDK() {
  console.log(uniquePaymentsDivId);
  try {
    payfabricpaymentssdk = new payfabricpayments({
      environment: 'SANDBOX',
      target: 'uniquePaymentsDivId',
      displayMethod: 'DIALOG',
      session: jwtToken,
      successUrl: '/OrderSuccess',
      failureUrl: '/OrderFailure',
      cancelUrl: '/OrderCancel'
    });
  } catch (error) {
    console.log(error);
    // Handle unexpected SDK initialization errors
  }
}

function load_apple_js(){
  console.log('loaded');
}

function payFabricSDKLoaded() {
  console.log(uniquePaymentsDivId);
  loadPaymentsSDK();
  // PayFabric SDK has loaded, you can call loadPaymentsSDK function directly from here for immediately presentment of the payment box.
}

//let apple_button=document.getElementById('apple_pay_button');

// function showbutton(){
//   apple_button.style.display='block';
// }

document.addEventListener("DOMContentLoaded", function () {
  console.log(window.ApplePaySession)
  if (window.ApplePaySession) {
    console.log(ApplePaySession.canMakePayments())
    if (ApplePaySession.canMakePayments()) {
      var merchantIdentifier = "merchant.com.getmyparking.consumer.development";
          var button = document.getElementById("apple-pay-button");
          console.log('button', button);
          button.addEventListener("click", function () {
            var paymentRequest = {
              merchantIdentifier: merchantIdentifier,
              countryCode: "US",
              currencyCode: "USD",
              supportedNetworks: ["visa", "masterCard", "amex"],
              merchantCapabilities: ["supports3DS"],
              total: {
                label: "My Product",
                amount: "1.00",
              },
            };

            var session = new ApplePaySession(14, paymentRequest);
            console.log(session)

             session.onvalidatemerchant = async event => {
              console.log(event)
              var validationURL = event.validationURL;
              try {
                // Make a POST request to your server with the validationURL
                const response = await fetch('/api/apple-pay/validate', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    "applePayUrl":"https://apple-pay-gateway-cert.apple.com/paymentservices/startSession"
                  },
               //   body: JSON.stringify({ validationURL }),
               body:{"merchantIdentifier": "merchant.com.getmyparking.consumer.development",
               "displayName": "MyStore",
               "initiative": "web",
               "initiativeContext": "https://master--transcendent-brigadeiros-3c74ae.netlify.app/"}
                });
          
                // Assuming your server responds with the validation result as JSON
               const validationResult = await response.json();
               if (validationResult && validationResult.success) {
                console.log("Merchant validation successful");
                // Call session.completeMerchantValidation with the validationResult
             const result=    session.completeMerchantValidation(validationResult);
             console.log(result)
              } else {
                console.log("Merchant validation failed");
                // If the validationResult indicates a failure, you can handle it accordingly.
                // For example, you might show an error message to the user or cancel the payment.
                // session.abort(); // Abort the payment session if validation fails.
              }
            } catch (error) {
              console.log("Error validating merchant", error);
              }
                // Call your own server to request a new merchant session.
              // fetch(validationURL)
              // .then(res => res.json()) // Parse response as JSON.
              // .then(merchantSession => {
              //   console.log(merchantSession)
              //   session.completeMerchantValidation(merchantSession);
              // })
            
              // catch (error){
              //   console.log(error)
              // }
            
            
            
            }

          console.log('After validation');
            // // Handle shipping method selection
            // session.onshippingmethodselected = function(event) {
            //   // Update the payment request with the selected shipping method
            //   // Call session.completeShippingMethodSelection with the updated payment request
            //   console.log('shipping method',event);
            //   session.completeShippingMethodSelection({});
            // };

            // Handle payment authorization
            // session.onpaymentauthorized = function(event) {
        
            //   console.log(ApplePaySession.STATUS_SUCCESS);
            //   console.log('authorization', event);
            //   session.completePayment(ApplePaySession.STATUS_SUCCESS);
           
            // };

            session.onpaymentauthorized = function (event) {
              // Process the payment using the event.payment.token object
              // Call session.completePayment with a success or failure status
              console.log(ApplePaySession.STATUS_SUCCESS);
              console.log('authorization', event);
              // Call your custom function for processing the order and capturing the payment
              processPayment(event.payment);



              
            };

            // Start the Apple Pay session
            session.begin();

            function processPayment(payment) {

              const myToken= payment.token
              console.log(myToken);
              
            }





          });
    }
    
  }
});
