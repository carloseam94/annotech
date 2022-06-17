/**
* Download a file with the provided content, filename and contentType.
*
* @param {object} content The object to download.
* @param {string} filename The name of the file to download.
* @param {string} contentType The type of the file to download.
* @return {void} void
*/
export function downloadBlob(content, filename, contentType) {
    // Create a blob
    var blob = new Blob([content], { type: contentType });
    var url = URL.createObjectURL(blob);

    // Create a link to download it
    var elem = document.createElement("a");
    elem.href = url;
    elem.setAttribute("download", filename);
    elem.click();
}
