// Add / Remove Item Rows
const addItemBtn = document.getElementById('add-item-btn');
const itemsContainer = document.getElementById('items-container');

addItemBtn.addEventListener('click', () => {
  const itemRow = document.createElement('div');
  itemRow.classList.add('item-row');
  itemRow.innerHTML = `
    <input type="text" name="itemName" placeholder="Item Name" required />
    <input type="number" name="itemQty" placeholder="Qty" min="1" required />
    <input type="number" name="itemPrice" placeholder="Unit Price" min="0" step="0.01" required />
    <button type="button" class="remove-item-btn">Remove</button>
  `;
  itemsContainer.appendChild(itemRow);

  itemRow.querySelector('.remove-item-btn').addEventListener('click', () => {
    itemRow.remove();
  });
});

// Remove buttons for existing rows
document.querySelectorAll('.remove-item-btn').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.target.closest('.item-row').remove();
  });
});

const form = document.getElementById('invoice-form');
const invoicePreview = document.getElementById('invoice-preview');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Get form values
  const docType = form.docType.value;
  const docNumber = form.docNumber.value.trim();
  const date = form.date.value;
  const clientName = form.clientName.value.trim();
  const clientEmail = form.clientEmail.value.trim();
  const clientPhone = form.clientPhone.value.trim();
  const clientAddress = form.clientAddress.value.trim();
  const notes = form.notes.value.trim();

  // Collect items data
  const items = [];
  const itemRows = itemsContainer.querySelectorAll('.item-row');
  itemRows.forEach((row) => {
    const name = row.querySelector('input[name="itemName"]').value.trim();
    const qty = parseInt(row.querySelector('input[name="itemQty"]').value);
    const price = parseFloat(row.querySelector('input[name="itemPrice"]').value);
    if (name && qty > 0 && price >= 0) {
      items.push({ name, qty, price });
    }
  });

  if (items.length === 0) {
    alert('Please add at least one valid item.');
    return;
  }

  // Calculate totals
  let subTotal = 0;
  items.forEach((item) => {
    subTotal += item.qty * item.price;
  });

  const taxRate = 0.18; // 18% GST for example
  const taxAmount = subTotal * taxRate;
  const grandTotal = subTotal + taxAmount;

  // Build invoice HTML for preview and PDF
  invoicePreview.innerHTML = `
    <header>
      <img src="https://drive.google.com/uc?export=view&id=15pbzbPmjxhMwwKelKp9jhFIsGOMjooJK" alt="Universal Tribes Logo" />
      <div class="company-info">
        <strong>Universal Tribes</strong><br />
        Phone: +91 12345 67890<br />
        Email: info@universaltribes.com<br />
        Website: www.universaltribes.com
      </div>
    </header>
    <h2>${docType}</h2>
    <div class="section">
      <strong>${docType} Number:</strong> ${docNumber}<br />
      <strong>Date:</strong> ${date}
    </div>
    <div class="section">
      <h3>Bill To:</h3>
      <strong>${clientName}</strong><br />
      Email: ${clientEmail}<br />
      Phone: ${clientPhone}<br />
      Address:<br />
      ${clientAddress.replace(/\n/g, '<br />')}
    </div>
    <div class="section">
      <h3>Items</h3>
      <table>
        <thead>
          <tr>
            <th>Sr.</th>
            <th>Item Description</th>
            <th>Qty</th>
            <th>Unit Price (₹)</th>
            <th>Total (₹)</th>
          </tr>
        </thead>
        <tbody>
          ${items
            .map(
              (item, i) =>
                `<tr>
                  <td>${i + 1}</td>
                  <td>${item.name}</td>
                  <td>${item.qty}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>${(item.qty * item.price).toFixed(2)}</td>
                </tr>`
            )
            .join('')}
        </tbody>
      </table>
    </div>
    <div class="section totals">
      <table>
        <tr>
          <th>Subtotal:</th>
          <td>₹${subTotal.toFixed(2)}</td>
        </tr>
        <tr>
          <th>GST (18%):</th>
          <td>₹${taxAmount.toFixed(2)}</td>
        </tr>
        <tr>
          <th>Total:</th>
          <td><strong>₹${grandTotal.toFixed(2)}</strong></td>
        </tr>
      </table>
    </div>
    <div class="section">
      <h3>Notes:</h3>
      <p>${notes || 'N/A'}</p>
    </div>
    <footer>
      <p>Thank you for your business!</p>
    </footer>
  `;

  invoicePreview.style.display = 'block';

  // Generate PDF
  const { jsPDF } = window.jspdf;

  try {
    const canvas = await html2canvas(invoicePreview, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'pt', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

    pdf.save(`${docNumber}_${docType}.pdf`);
  } catch (error) {
    alert('Failed to generate PDF. Please try again.');
    console.error(error);
  }

  invoicePreview.style.display = 'none';
});
