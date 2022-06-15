export function downloadBlob(content, filename, contentType) {
    // Create a blob
    var blob = new Blob([content], { type: contentType });
    var url = URL.createObjectURL(blob);

    // Create a link to download it and then destroy it
    var elem = document.createElement("a");
    elem.href = url;
    elem.setAttribute("download", filename);
    elem.click();
    elem = null;
}
