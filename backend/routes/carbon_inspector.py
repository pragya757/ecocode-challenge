import urllib.request
import urllib.parse
import json
import re
import time
import ssl
from flask import Blueprint, request, jsonify

carbon_inspector_bp = Blueprint('carbon_inspector', __name__)

# Ignore self-signed SSL certificate issues during audit fetch
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE


def check_green_host(hostname):
    """Query The Green Web Foundation API to verify if host uses renewable energy."""
    try:
        gwf_url = f"https://api.thegreenwebfoundation.org/greencheck/{hostname}"
        req = urllib.request.Request(
            gwf_url,
            headers={'User-Agent': 'EcoCode-Carbon-Inspector/1.0'}
        )
        with urllib.request.urlopen(req, timeout=3, context=ctx) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            return {
                'green': data.get('green', False),
                'hosted_by': data.get('hosted_by') or 'Unknown Provider',
                'url': data.get('url', hostname)
            }
    except Exception:
        return {'green': False, 'hosted_by': 'Cloud / Standard Grid', 'url': hostname}


def calculate_grade(grams_co2):
    """Calculate EcoCode Green Web Rating (A+ to F)."""
    if grams_co2 <= 0.18:
        return {'grade': 'A+', 'color': 'emerald', 'desc': 'Ultra Eco-Friendly'}
    elif grams_co2 <= 0.35:
        return {'grade': 'A', 'color': 'green', 'desc': 'Great Green Efficiency'}
    elif grams_co2 <= 0.65:
        return {'grade': 'B', 'color': 'lime', 'desc': 'Good, minor room for optimization'}
    elif grams_co2 <= 1.10:
        return {'grade': 'C', 'color': 'amber', 'desc': 'Average, significant waste detected'}
    elif grams_co2 <= 1.80:
        return {'grade': 'D', 'color': 'orange', 'desc': 'High energy consumption'}
    else:
        return {'grade': 'F', 'color': 'rose', 'desc': 'Critical Carbon Footprint'}


@carbon_inspector_bp.route('/audit', methods=['POST'])
def audit_website():
    data = request.get_json() or {}
    raw_url = data.get('url', '').strip()

    if not raw_url:
        return jsonify({'error': 'Please provide a valid website URL'}), 400

    # Ensure URL has protocol
    if not raw_url.startswith(('http://', 'https://')):
        url = 'https://' + raw_url
    else:
        url = raw_url

    parsed = urllib.parse.urlparse(url)
    hostname = parsed.hostname
    if not hostname:
        return jsonify({'error': 'Invalid URL hostname format'}), 400

    start_time = time.time()
    try:
        req = urllib.request.Request(
            url,
            headers={
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) EcoCode/1.0 (Green Web Scanner)',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br'
            }
        )

        with urllib.request.urlopen(req, timeout=8, context=ctx) as response:
            latency_ms = round((time.time() - start_time) * 1000)
            status_code = response.getcode()
            headers = dict(response.info())

            # Read up to 2MB HTML content safely
            content_sample = response.read(2097152)
            bytes_transferred = len(content_sample)

            content_length_hdr = headers.get('Content-Length') or headers.get('content-length')
            if content_length_hdr and content_length_hdr.isdigit():
                bytes_transferred = max(bytes_transferred, int(content_length_hdr))

            # Analyze headers
            encoding = headers.get('Content-Encoding') or headers.get('content-encoding', 'none')
            is_compressed = any(c in encoding.lower() for c in ['gzip', 'br', 'deflate'])
            cache_control = headers.get('Cache-Control') or headers.get('cache-control', '')
            has_caching = bool(cache_control and 'no-cache' not in cache_control.lower())

            # Extract basic HTML tags to inspect asset weight
            html_text = content_sample.decode('utf-8', errors='ignore')
            script_count = len(re.findall(r'<script\b', html_text, re.IGNORECASE))
            stylesheet_count = len(re.findall(r'<link[^>]+rel=["\']?stylesheet', html_text, re.IGNORECASE))
            image_count = len(re.findall(r'<img\b', html_text, re.IGNORECASE))

    except Exception as e:
        return jsonify({
            'error': f"Failed to audit {url}: {str(e)}. Please ensure the URL is publicly reachable."
        }), 400

    # Query Green Web Foundation
    green_host_info = check_green_host(hostname)
    is_green_host = green_host_info.get('green', False)

    # Sustainable Web Design (SWD) Model
    # Data transferred in GB
    kb_transferred = round(bytes_transferred / 1024, 1)
    data_gb = bytes_transferred / (1024 ** 3)

    # SWD constant: 0.81 kWh per GB of data transferred
    kwh_consumed = data_gb * 0.81

    # Carbon intensity: 50 g/kWh if green renewable host, 442 g/kWh global grid average
    carbon_intensity = 50 if is_green_host else 442
    grams_co2 = round(kwh_consumed * carbon_intensity, 3)

    # Monthly & Annual Projections (based on 10,000 monthly visits)
    monthly_views = 10000
    annual_co2_kg = round((grams_co2 * monthly_views * 12) / 1000, 2)

    # Equivalents
    smartphone_charges = round(grams_co2 / 8.22, 1)
    car_meters_driven = round((grams_co2 / 120) * 1000, 1)  # ~120g/km = ~0.12g/m
    trees_needed_annual = round(annual_co2_kg / 21, 1)      # 1 mature tree absorbs ~21kg/year

    # Grade
    grade_info = calculate_grade(grams_co2)

    # Recommendations
    recommendations = []
    if not is_green_host:
        recommendations.append({
            'title': 'Switch to Green Renewable Hosting',
            'severity': 'high',
            'desc': f'This site is powered by standard grid electricity (~442g CO₂/kWh). Migrating to a certified green host will immediately reduce emissions by up to ~88%.'
        })
    if not is_compressed:
        recommendations.append({
            'title': 'Enable Modern Text Compression (Brotli / Gzip)',
            'severity': 'high',
            'desc': 'No HTTP compression header detected. Enabling Brotli or Gzip compression reduces HTML/CSS/JS payload sizes by 60%–80%.'
        })
    if not has_caching:
        recommendations.append({
            'title': 'Configure Cache-Control Headers',
            'severity': 'medium',
            'desc': 'Missing or suboptimal HTTP cache headers. Adding Cache-Control: max-age prevents repeat visitors from re-downloading static assets.'
        })
    if script_count > 15:
        recommendations.append({
            'title': f'Consolidate Script Payloads ({script_count} scripts found)',
            'severity': 'medium',
            'desc': 'High number of external script tags detected. Bundle and defer non-critical JS to reduce CPU execution cycles and battery drain on client devices.'
        })
    if image_count > 10:
        recommendations.append({
            'title': f'Optimize Image Formats ({image_count} images found)',
            'severity': 'low',
            'desc': 'Ensure modern formats like WebP or AVIF are used along with loading="lazy" attributes to prevent off-screen image payload downloads.'
        })

    if not recommendations:
        recommendations.append({
            'title': 'Outstanding Green Architecture!',
            'severity': 'optimal',
            'desc': 'This website follows top-tier sustainability best practices: lightweight payload, clean energy hosting, and efficient caching.'
        })

    return jsonify({
        'url': url,
        'hostname': hostname,
        'status_code': status_code,
        'latency_ms': latency_ms,
        'kb_transferred': kb_transferred,
        'is_compressed': is_compressed,
        'encoding': encoding,
        'has_caching': has_caching,
        'green_host': green_host_info,
        'grams_co2': grams_co2,
        'annual_co2_kg': annual_co2_kg,
        'equivalents': {
            'smartphone_charges': smartphone_charges,
            'car_meters_driven': car_meters_driven,
            'trees_needed_annual': trees_needed_annual
        },
        'grade': grade_info,
        'page_breakdown': {
            'scripts': script_count,
            'stylesheets': stylesheet_count,
            'images': image_count
        },
        'recommendations': recommendations
    }), 200
