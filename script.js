document.getElementById("downloadBtn").addEventListener("click", () => {
    const docType = document.getElementById("docType").value;
    const docNumber = document.getElementById("invoice-number").value.trim() || "document";
    const customerName = document.getElementById("customerName").value.trim();
    const customerAddress = document.getElementById("customerAddress").value.trim();
    const itemDesc = document.getElementById("itemDesc").value.trim();
    const quantity = parseInt(document.getElementById("quantity").value);
    const rate = parseFloat(document.getElementById("rate").value);
    const gst = parseFloat(document.getElementById("gst").value);

    if (!customerName || !customerAddress || !itemDesc || !quantity || !rate || isNaN(gst)) {
        alert("Please fill all fields correctly.");
        return;
    }

    // Calculations
    const subtotal = quantity * rate;
    const gstAmount = (subtotal * gst) / 100;
    const total = subtotal + gstAmount;

    // Create invoice HTML
    const invoiceHTML = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 700px;">
            <h2 style="color: #5b2c6f;">Universal Tribes</h2>
            <p>Near, D-3/5, Shiv Shanker Society, KK Market Rd, Bibwewadi, Pune, Maharashtra 411037</p>
            <p>Email: info@universaltribes.com | Phone: 81423 11100</p>
            <p>GSTIN: 27AALCT2080P1ZP | PAN: AALCT20280P</p>
            <p>Website: <a href="https://universaltribes.com/" target="_blank">universaltribes.com</a></p>
            <hr style="margin: 20px 0;" />

            <h3>${docType} #: ${docNumber}</h3>
            <p><strong>Bill To:</strong> ${customerName}</p>
            <p>${customerAddress.replace(/\n/g, "<br>")}</p>
            <hr style="margin: 20px 0;" />

            <table width="100%" border="1" cellspacing="0" cellpadding="8" style="border-collapse: collapse;">
                <thead style="background-color: #5b2c6f; color: white;">
                    <tr>
                        <th align="left">Description</th>
                        <th align="right">Quantity</th>
                        <th align="right">Rate (₹)</th>
                        <th align="right">Amount (₹)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${itemDesc}</td>
                        <td align="right">${quantity}</td>
                        <td align="right">${rate.toFixed(2)}</td>
                        <td align="right">${subtotal.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>

            <table width="100%" cellspacing="0" cellpadding="8" style="margin-top: 15px;">
                <tbody>
                    <tr>
                        <td align="right"><strong>Subtotal:</strong></td>
                        <td align="right">₹${subtotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td align="right"><strong>GST (${gst}%):</strong></td>
                        <td align="right">₹${gstAmount.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td align="right"><strong>Total:</strong></td>
                        <td align="right"><strong>₹${total.toFixed(2)}</strong></td>
                    </tr>
                </tbody>
            </table>

            <div style="margin-top: 40px; font-style: italic; color: #555;">
                <p>Bank Details will be added later.</p>
                <p>Thank you for your business!</p>
            </div>
        </div>
    `;

    // Insert invoice preview (optional - for visual confirmation before download)
    const preview = document.getElementById("invoice-preview");
    preview.innerHTML = invoiceHTML;
    preview.style.display = "block";

    // PDF generation options
    const opt = {
        margin: 0.5,
        filename: `${docType}_${docNumber}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    // Generate and save PDF
    html2pdf().set(opt).from(preview).save();
});
