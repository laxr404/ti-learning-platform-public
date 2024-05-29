import express from 'express';
import Twig from 'twig';
import ejs from 'ejs';
import pug from 'pug';

const app = express();
const port = 44044;

app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

function getHTML(lab, compiledMessage) {
    const htmlContent = `<!DOCTYPE html>
        <html>
        <head>
            <title>My Book Shop</title>
            <link rel="stylesheet" href="/static/labstyles.css">
        </head>
        <body>
        
            <header>
                <h1>Welcome to My Book Shop</h1>
                <nav>
                    <ul>
                        <li><a href="#home">Home</a></li>
                        <li><a href="#products">Books</a></li>
                        <li><a href="#about">About Us</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                </nav>
            </header>
        
            <section id="home">
                <h2>Home</h2>
                <p>Welcome to My Book Shop! Your one-stop destination for the best books in all genres. Dive into our world of literature and find your next great read.</p>
            </section>
    
            <div class="stock-message">
            ${compiledMessage}
            </div>

            <section id="products">
                <h2>Our Books</h2>
                <ul>
                    <li>
                        <img src="https://images.pexels.com/photos/2090104/pexels-photo-2090104.jpeg" alt="The Polaroid Book">
                        <h3>Book Title 1</h3>
                        <p>Discover the thrilling world of Book 1. An exciting adventure awaits.</p>
                        <button class="buy-button">Buy Now!</button>
    
    
            
                    </li>
                    <li>
                        <img src="https://images.pexels.com/photos/3747279/pexels-photo-3747279.jpeg" alt="Black and White Book Cover">
                        <h3>Book Title 2</h3>
                        <p>Book 2 takes you on a journey through uncharted territories. A must-read for enthusiasts.</p>
                        <button class="buy-button">Buy Now!</button>
    
    
            
                    </li>
                    <li>
                        <img src="https://images.pexels.com/photos/904620/pexels-photo-904620.jpeg" alt="Your Soul is a River Book">
                        <h3>Book Title 3</h3>
                        <p>Immerse yourself in the captivating story of Book 3. A tale that will stay with you.</p>
                        <button class="buy-button">Buy Now!</button>
    
    
            
                    </li>
                </ul>
            </section>
        
            <section id="about">
                <h2>About Us</h2>
                <p>My Book Shop was founded in 2024 with the vision of bringing together book lovers and the finest selection of literature. We believe in the power of stories to inspire and transform.</p>
            </section>
        
            <section id="contact">
                <h2>Contact</h2>
                <p>Got questions? Reach out to us at contact@mybookshop.com or visit our store at 123 Book Street, Reading Town.</p>
            </section>
        
            <footer>
                <p>© 2024 My Book Shop</p>
            </footer>
            <script>
                document.addEventListener('DOMContentLoaded', function() {
                    const buttons = document.querySelectorAll('.buy-button');
                    buttons.forEach(function(button) {
                        button.addEventListener('click', function() {
                            redirectToMessage('We are out of stock');
                        });
                    });
                });
                
                function redirectToMessage(message) {
                    location.href = '/attacklabs/lab/lab_${lab}/message?stockMessage=' + encodeURIComponent(message);
                }
            </script>
        </body>
        </html>`;
    return htmlContent;
}

app.get('/lab_b1', (req, res) => {
    try {
        const htmlContent = getHTML("b1", "")
        res.send(htmlContent);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.toString());
    }
});

app.get('/lab_b1/message', (req, res) => {
    try {
        const stockMessage = req.query.stockMessage 
                            ? decodeURIComponent(req.query.stockMessage)
                            : 'No message provided';

        // Compile the stockMessage string using Pug
        const compiledMessage = pug.compile("p "+stockMessage)();
        
        // Construct the complete HTML response with standard HTML structure
        const html = getHTML("b1", compiledMessage);

        res.send(html);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.toString());
    }
});


app.get('/lab_b2', (req, res) => {
    try {
        const htmlContent = getHTML("b2", "")

        res.send(htmlContent);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.toString());
    }
});


app.get('/lab_b2/message', (req, res) => {
    // Define the stockMessage based on the query parameter or default value
    const stockMessage = req.query.stockMessage ? req.query.stockMessage : 'No message provided';

    try {
        // Attempt to compile the stockMessage string using EJS
        const compiledMessage = ejs.render(stockMessage);

        // Construct the complete HTML response with the compiled message
        const html = getHTML("b2", compiledMessage);

    res.send(html);

    } catch (e) {
        // If an error occurs during compilation, log the error and send the error message
        console.error("Error in EJS compilation: ", e);
        res.send("Error compiling the template");
    }
});


app.get('/lab_i1', (req, res) => {
    try {
        const htmlContent = getHTML("i1", "")

        res.send(htmlContent);
    } catch (e) {
        console.error(e);
        res.status(500).send(e.toString());
    }
});


app.get('/lab_i1/message', (req, res) => {
    // Define the stockMessage based on the query parameter or default value
    const stockMessage = req.query.stockMessage ? req.query.stockMessage : 'No message provided';

    let compiledMessage;

    try {
        // Attempt to compile the stockMessage string using Twig
        compiledMessage = Twig.twig({ data: stockMessage }).render({});
    } catch (e) {
        // If an error occurs during compilation, log the error and use the original stockMessage
        console.error("Error in Twig.js compilation: ", e);
        compiledMessage = stockMessage;
    }

    // Construct the complete HTML response with the compiled message
    const html = getHTML("i1", compiledMessage)

    res.send(html);
    
});

app.listen(port, (callback) => {
    console.log(`Express app listening on port ${port}`)
    if (callback) {
      console.log(`received callback ${callback}`)
    }
  })
