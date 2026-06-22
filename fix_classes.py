import re

css_file = 'src/Dashboard.css'
jsx_file = 'src/Dashboard.jsx'

with open(css_file, 'r') as f:
    css = f.read()

with open(jsx_file, 'r') as f:
    jsx = f.read()

classes = [
    'stats-grid',
    'stat-card',
    'stat-icon-wrapper',
    'stat-info',
    'stat-label',
    'stat-value',
    'card',
    'btn',
    'btn-primary',
    'btn-secondary',
    'btn-large',
    'btn-sm',
    'badge',
    'status-active',
    'table-header'
]

for c in classes:
    # In CSS, replace .className
    css = css.replace(f'.{c} ', f'.dash-{c} ')
    css = css.replace(f'.{c}{{', f'.dash-{c}{{')
    css = css.replace(f'.{c}:', f'.dash-{c}:')
    css = css.replace(f'.{c},', f'.dash-{c},')
    css = css.replace(f'.{c}\n', f'.dash-{c}\n')
    
    # In JSX, replace instances inside quotes (e.g. class="card", class="btn btn-primary")
    # A bit carefully with regex to only match the exact class name
    jsx = re.sub(fr'\b{c}\b', f'dash-{c}', jsx)

with open(css_file, 'w') as f:
    f.write(css)

with open(jsx_file, 'w') as f:
    f.write(jsx)

print("Renamed classes in Dashboard.css and Dashboard.jsx")
