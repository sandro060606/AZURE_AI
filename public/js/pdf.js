const btnAnalizar = document.getElementById("btnAnalizar");
const pdfFile = document.getElementById("pdfFile");
const pdfUrl = document.getElementById("pdfUrl");
const fileInputSection = document.getElementById("fileInputSection");
const urlInputSection = document.getElementById("urlInputSection");
const resultado = document.getElementById("resultado");
const loading = document.getElementById("loading");
const error = document.getElementById("error");
const errorMensaje = document.getElementById("errorMensaje");

document.querySelectorAll('input[name="inputType"]').forEach((radio) => {
  radio.addEventListener("change", (e) => {
    if (e.target.value === "file") {
      fileInputSection.style.display = "block";
      urlInputSection.style.display = "none";
    } else {
      fileInputSection.style.display = "none";
      urlInputSection.style.display = "block";
    }
  });
});

btnAnalizar.addEventListener("click", async () => {
  const inputType = document.querySelector('input[name="inputType"]:checked').value;

  if (inputType === "file") {
    if (pdfFile.files.length === 0) {
      showError("Por favor selecciona un archivo PDF");
      return;
    }

    const formData = new FormData();
    formData.append("pdfFile", pdfFile.files[0]);

    try {
      showLoading();
      const response = await fetch("/api/pdf/analizar-file", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Error al analizar el PDF");
      }

      displayResults(data.data);
    } catch (err) {
      showError(err.message);
    }
  } else {
    const documentUrl = pdfUrl.value.trim();
    if (!documentUrl) {
      showError("Por favor ingresa una URL del PDF");
      return;
    }

    try {
      showLoading();
      const response = await fetch("/api/pdf/analizar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ documentUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al analizar el PDF");
      }

      displayResults(data.data);
    } catch (err) {
      showError(err.message);
    }
  }
});

function showLoading() {
  loading.style.display = "block";
  resultado.style.display = "none";
  error.style.display = "none";
}

function showError(message) {
  loading.style.display = "none";
  resultado.style.display = "none";
  error.style.display = "block";
  errorMensaje.textContent = message;
}

function displayResults(data) {
  loading.style.display = "none";
  error.style.display = "none";
  resultado.style.display = "block";

  const fields = data.fields || {};

  // Información básica
  document.getElementById("idFactura").textContent = fields.InvoiceId?.valueString || "N/A";
  document.getElementById("fechaFactura").textContent = fields.InvoiceDate?.valueDate || "N/A";
  document.getElementById("fechaVencimiento").textContent = fields.DueDate?.valueDate || "N/A";
  document.getElementById("clienteNombre").textContent = fields.CustomerName?.valueString || "N/A";
  document.getElementById("clienteId").textContent = fields.CustomerId?.valueString || "N/A";
  document.getElementById("vendedorNombre").textContent = fields.VendorName?.valueString || "N/A";
  document.getElementById("subtotal").textContent = fields.SubTotal?.content || "N/A";
  document.getElementById("impuestoTotal").textContent = fields.TotalTax?.content || "N/A";
  document.getElementById("totalFactura").textContent = fields.InvoiceTotal?.content || "N/A";
  document.getElementById("totalPagar").textContent = fields.AmountDue?.content || "N/A";

  // Items
  const itemsContainer = document.getElementById("contenedorItems");
  itemsContainer.innerHTML = "";

  if (fields.Items?.valueArray) {
    fields.Items.valueArray.forEach((item) => {
      const itemData = item.valueObject;
      const itemDiv = document.createElement("div");
      itemDiv.className = "item-card";
      itemDiv.innerHTML = `
                <div class="item-details">
                    <div class="item-detail">
                        <span>Descripción:</span>
                        <span>${itemData.Description?.valueString || "N/A"}</span>
                    </div>
                    <div class="item-detail">
                        <span>Cantidad:</span>
                        <span>${itemData.Quantity?.valueNumber || "N/A"}</span>
                    </div>
                    <div class="item-detail">
                        <span>Precio Unitario:</span>
                        <span>${itemData.Amount?.content || "N/A"}</span>
                    </div>
                </div>
            `;
      itemsContainer.appendChild(itemDiv);
    });
  }

  // Direcciones
  document.getElementById("direccionCliente").textContent = fields.CustomerAddress?.content || "N/A";
  document.getElementById("direccionFacturacion").textContent = fields.BillingAddress?.content || "N/A";
}
