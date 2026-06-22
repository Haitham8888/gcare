import os
import ftplib
import time

from dotenv import load_dotenv
load_dotenv()

ftp_host = os.getenv("FTP_HOST")
ftp_user = os.getenv("FTP_USER")
ftp_pass = os.getenv("FTP_PASS")
ftp_dir = "public_html"
local_dir = "dist"

EXCLUDED_PREFIXES = {
    "static/",
}

ESSENTIAL_STATIC_VID_FILES = {
    "intro.mp4",
}

ESSENTIAL_STATIC_IMG_FILES = {
    "12.png",
    "13.png",
    "G - Care-01.svg",
    "G - Care-41.svg",
    "G - Care-48.svg",
    "G - Care-50.svg",
    "whitelogo.svg",
    "in.svg",
    "x.svg",
    "whatsapp.svg",
    "tiktok.svg",
    "insta.svg",
    "instagram.svg",
    "linkedin-white.svg",
    "LinkedIn_icon.svg",
    "paper-plane.svg",
}

def get_ftp():
    ftp = ftplib.FTP(ftp_host)
    ftp.login(ftp_user, ftp_pass)
    ftp.set_pasv(True)
    return ftp

def ensure_dir(ftp, remote_path):
    dirs = [d for d in remote_path.split("/") if d]
    current = ""
    for d in dirs:
        current += f"/{d}"
        try:
            ftp.cwd(current)
        except ftplib.error_perm:
            try:
                ftp.mkd(current)
                ftp.cwd(current)
            except ftplib.error_perm as e:
                pass # Already exists or no permission

def should_upload(rel_path):
    clean_rel = rel_path.replace('\\', '/').lstrip('./')

    for prefix in EXCLUDED_PREFIXES:
        if clean_rel.startswith(prefix):
            return False

    if clean_rel.startswith("static/img/"):
        file_name = clean_rel.split("/")[-1]
        parent = clean_rel[:-len(file_name)]
        # Keep only top-level essential icons/logos under static/img
        if parent != "static/img/":
            return False
        return file_name in ESSENTIAL_STATIC_IMG_FILES

    if clean_rel.startswith("static/vid/"):
        file_name = clean_rel.split("/")[-1]
        parent = clean_rel[:-len(file_name)]
        if parent != "static/vid/":
            return False
        return file_name in ESSENTIAL_STATIC_VID_FILES

    return True

def upload_folder(local_path, remote_path, relative_prefix=""):
    print(f"Directory: {local_path} -> {remote_path}")
    ftp = get_ftp()
    ensure_dir(ftp, remote_path)
    ftp.quit()

    for item in os.listdir(local_path):
        local_item = os.path.join(local_path, item)
        rel_item = f"{relative_prefix}/{item}".lstrip('/')

        if os.path.isfile(local_item):
            if not should_upload(rel_item):
                print(f" SKIP {rel_item}")
                continue
            # Only upload if it's new (simple implementation: just upload everything but handle retries)
            for attempt in range(4):
                try:
                    ftp_file = get_ftp()
                    ftp_file.cwd(remote_path)
                    print(f" STOR {item} at {remote_path}")
                    with open(local_item, 'rb') as f:
                        ftp_file.storbinary(f"STOR {item}", f)
                    ftp_file.quit()
                    break
                except Exception as e:
                    print(f" Failed {item}: {e}. Retrying ({attempt+1}/3)...")
                    time.sleep(2)
        elif os.path.isdir(local_item):
            if any(rel_item.replace('\\', '/').startswith(prefix.rstrip('/')) for prefix in EXCLUDED_PREFIXES):
                print(f" SKIP DIR {rel_item}")
                continue
            remote_item_path = f"{remote_path}/{item}"
            upload_folder(local_item, remote_item_path, rel_item)

if __name__ == "__main__":
    try:
        base_remote_path = f"/{ftp_dir}"
        upload_folder(local_dir, base_remote_path)
        print("Upload complete.")
    except Exception as e:
        print(f"An error occurred: {e}")
