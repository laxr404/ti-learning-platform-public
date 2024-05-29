
import { select, hierarchy, tree, linkHorizontal } from "https://cdn.skypack.dev/d3@7";

let openPanel = null; // Global variable to keep track of the open panel

// Function to escape HTML entities in a string
function escapeHtml(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

export async function createTree() {
    const width = 1500;
    const height = 1900;

    // Define the default color for nodes with children
    const defaultNodeColor = "#8396A8D4";

    // Function to close the open panel
    function closePanel() {
        if (openPanel) {
            openPanel.remove();
            openPanel = null; // Reset the open panel reference
        }
    }

    // Add event listener for the "Escape" key
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closePanel();
        }
    });

    // Create an SVG element inside the decisionTree div
    const svg = select("#decisionTree")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(40,0)");

    try {
        // Fetch the tree data from treenodes.json
        const response = await fetch('js/treenodes.json');
        const data = await response.json();

        // Create the root for the tree using d3.hierarchy
        const root = hierarchy(data);

        // Create the tree layout and get the nodes and links
        const treeLayout = tree().size([height - 50, width - 160]);
        treeLayout(root);

        // Create links between nodes
        svg.selectAll(".link")
            .data(root.links())
            .enter().append("path")
            .attr("class", "link")
            .attr("d", linkHorizontal()
                .x(d => d.y)
                .y(d => d.x))
            .attr("fill", "none");

        // Create each node as a group (g)
        const node = svg.selectAll(".node")
            .data(root.descendants())
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", d => `translate(${d.y},${d.x})`);


        node.append("circle")
            .attr("r", 6)
            .attr("fill", d => {
                // Check if the node has a color property and if its value is a valid color
                if (d.data.color && /^#[0-9A-F]{6}$/i.test(d.data.color)) {
                    return d.data.color; // Use the specified color
                } else if (d.data.name === "END" && !d.children) {
                    return "red"; // Set color to red for END nodes with no children
                } else if (!d.children) {
                    return "green"; // Set color to green for other childless nodes
                } else {
                    return defaultNodeColor; // Use the default color for nodes with children
                }
            });


        // Set the root node color to #046C7A
        const rootNode = node.filter(d => d.depth === 0);
        rootNode.select("circle").attr("fill", "#046C7A");

        // Add a label to each node without interpreting HTML code
        node.append("text")
            .attr("dy", "0.35em")
            .attr("x", d => d.children ? -10 : 10)
            .style("text-anchor", d => d.children ? "end" : "start")
            .text(d => {
                if (d.depth === 0) {
                    return d.data.name; // Display the full label for the root node
                } else if (d.children) {
                    const maxLength = 8; // Set your desired character limit for other nodes
                    const label = d.data.name;
                    return label.length > maxLength ? label.substring(0, maxLength) + "..." : label;
                } else {
                    return d.data.name; // For nodes without children, display the full label
                }
            });

        // Function to toggle text color for node names based on dark mode
        function toggleNodeTextDarkMode() {
            const isDarkMode = localStorage.getItem('mode') === 'dark';
            const nodeTexts = document.querySelectorAll(".node text");

            nodeTexts.forEach((textElement) => {
                textElement.style.fill = isDarkMode ? "white" : "black";
            });
        }

        // Call this function when the page loads and when the dark mode is toggled
        document.addEventListener('DOMContentLoaded', function () {
            // Apply the initial setting based on localStorage
            toggleNodeTextDarkMode();

            // Set up the event listener for the dark mode toggle button
            const toggleModeButton = document.getElementById('toggle-mode');
            if (toggleModeButton) {
                toggleModeButton.addEventListener('click', function () {
                    toggleDarkMode(); // This function should toggle the 'dark-mode' class and update localStorage
                    toggleNodeTextDarkMode(); // Update the node text colors based on the new mode
                });
            }
        });

        // Function to create and open the panel
        function createAndOpenPanel(d) {
            // Check if there's an open panel, and if so, close it
            closePanel();

            // Create a panel to display the information or 'no info' if there's no info
            const panel = document.createElement("div");
            panel.classList.add("info-panel");

            // Create panel content with escaped HTML entities
            const panelContent = d.data.info ? escapeHtml(d.data.info) : "No info";
            panel.innerHTML = `
                <h3>${escapeHtml(d.data.name)}</h3>
                <div class="ui icon button" id="copyButton" data-clipboard-text="${escapeHtml(d.data.name)}">
                    <i class="clipboard outline icon"></i>
                </div>
                <div class="ui icon button" id="closeButton">
                    <i class="close icon"></i>
                </div>
                <p>${panelContent}</p>
            `;

            // JavaScript to handle the clipboard button click event
            const copyButton = panel.querySelector("#copyButton");
            copyButton.addEventListener("click", () => {
                const tempInput = document.createElement("input");
                tempInput.value = d.data.name; // You can change this to the payload data
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand("copy");
                document.body.removeChild(tempInput);

                // Toggle the "clicked" class to trigger the transition
                copyButton.classList.toggle("clicked");
            });

            // Add click event to close the panel
            const closeButton = panel.querySelector("#closeButton");
            closeButton.addEventListener("click", () => {
                closePanel();
            });

            // Append the panel to the body
            document.body.appendChild(panel);

            // Update the open panel reference
            openPanel = panel;
        }

        // Event listener for clicking on node text
        node.select("text").on("click", function (event, d) {
            createAndOpenPanel(d);
        });

        // Event listener for clicking on node circle
        node.select("circle").on("click", function (event, d) {
            createAndOpenPanel(d);
        });

    } catch (error) {
        console.error("Error loading the JSON file: " + error.message);
    }

}
