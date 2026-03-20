import zipfile
import xml.etree.ElementTree as ET

def get_docx_text(path):
    document = zipfile.ZipFile(path)
    xml_content = document.read('word/document.xml')
    document.close()
    tree = ET.fromstring(xml_content)
    
    # Namespaces
    ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
    
    paragraphs = []
    for paragraph in tree.iterfind('.//w:p', ns):
        texts = [node.text for node in paragraph.iterfind('.//w:t', ns) if node.text]
        if texts:
            paragraphs.append("".join(texts))
            
    return "\n\n".join(paragraphs)

if __name__ == "__main__":
    try:
        text = get_docx_text('BROKEN_SHADOW_Novel.docx')
        print(text)
    except Exception as e:
        print(f"Error: {e}")
