import React, { useRef } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';

// Neural Network HTML with pinch/zoom/pan support (no native deps needed)
const neuralNetworkHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; touch-action: none; }
        body {
            background: #0a0a0a;
            color: #00ff41;
            font-family: 'Courier New', monospace;
            overflow: hidden;
            touch-action: none;
            user-select: none;
            -webkit-user-select: none;
        }
        #canvas-container { 
            position: fixed; 
            top: 0; left: 0;
            width: 100vw; 
            height: 100vh;
            transform-origin: 0 0;
        }
        canvas { display: block; touch-action: none; }
        .overlay {
            position: absolute;
            top: 10px;
            left: 10px;
            z-index: 100;
            background: rgba(0,0,0,0.9);
            border: 1px solid #00ff41;
            padding: 10px;
            max-width: 280px;
            font-size: 11px;
            pointer-events: none;
        }
        .overlay h1 { font-size: 12px; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 2px; }
        .overlay .subject { color: #ff0040; font-weight: bold; }
        .overlay .doctrine { color: #ff6600; font-size: 14px; margin: 5px 0; text-shadow: 0 0 10px #ff6600; }
        .legend {
            position: absolute;
            bottom: 10px;
            right: 10px;
            z-index: 100;
            background: rgba(0,0,0,0.9);
            border: 1px solid #00ff41;
            padding: 10px;
            font-size: 9px;
            pointer-events: none;
        }
        .legend-item { margin: 3px 0; display: flex; align-items: center; }
        .legend-color { width: 10px; height: 10px; margin-right: 5px; border-radius: 2px; }
        #tooltip {
            position: absolute;
            background: rgba(0,0,0,0.95);
            border: 1px solid #00ff41;
            padding: 8px;
            max-width: 250px;
            font-size: 10px;
            display: none;
            z-index: 200;
            pointer-events: none;
        }
        .tooltip-title { color: #ff6600; font-weight: bold; margin-bottom: 3px; text-transform: uppercase; }
        #context-modal {
            position: fixed;
            top: 0; left: 0;
            width: 100vw; height: 100vh;
            background: rgba(0,0,0,0.9);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            padding: 20px;
        }
        #context-modal.active { display: flex; }
        .context-content {
            background: #0a0a0a;
            border: 2px solid;
            max-width: 90vw;
            max-height: 80vh;
            overflow-y: auto;
            padding: 0;
        }
        .context-header {
            padding: 15px;
            border-bottom: 1px solid;
            position: relative;
        }
        .context-title { font-size: 16px; font-weight: bold; text-transform: uppercase; margin-bottom: 5px; }
        .context-meta { font-size: 10px; display: flex; gap: 10px; }
        .context-category, .context-severity { padding: 2px 6px; border-radius: 2px; }
        .context-body { padding: 15px; font-size: 11px; }
        .context-summary { line-height: 1.5; margin-bottom: 15px; padding: 10px; background: rgba(255,255,255,0.03); border-left: 3px solid; }
        .context-details h3 { font-size: 10px; text-transform: uppercase; color: #666; margin-bottom: 8px; }
        .context-details ul { list-style: none; padding: 0; }
        .context-details li { padding: 5px 0; padding-left: 15px; position: relative; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .context-details li:before { content: ">"; position: absolute; left: 0; opacity: 0.5; }
        .context-close {
            position: absolute;
            top: 10px; right: 10px;
            background: transparent;
            border: 1px solid;
            padding: 4px 8px;
            cursor: pointer;
            font-family: inherit;
            font-size: 9px;
            text-transform: uppercase;
            color: inherit;
        }
        .context-connections { margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1); }
        .context-connections h3 { font-size: 10px; text-transform: uppercase; color: #666; margin-bottom: 8px; }
        .connection-item { padding: 4px 0; display: flex; justify-content: space-between; font-size: 10px; }
        .connection-type { opacity: 0.6; font-size: 9px; }
        .controls {
            position: absolute;
            bottom: 10px;
            left: 10px;
            z-index: 100;
            display: flex;
            gap: 5px;
        }
        .control-btn {
            background: rgba(0,0,0,0.9);
            border: 1px solid #00ff41;
            color: #00ff41;
            padding: 8px 12px;
            font-family: inherit;
            font-size: 10px;
            cursor: pointer;
            -webkit-touch-callout: none;
            -webkit-user-select: none;
        }
        .zoom-indicator {
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(0,0,0,0.9);
            border: 1px solid #00ff41;
            padding: 5px 10px;
            font-size: 10px;
            z-index: 100;
            pointer-events: none;
        }
    </style>
</head>
<body>
    <div id="canvas-container">
        <canvas id="network"></canvas>
        <div class="overlay">
            <h1>Neural Network Map</h1>
            <div>SUBJECT: <span class="subject">GEORGE WU</span></div>
            <div class="doctrine">HATE DOCTRINE</div>
            <div style="font-size:9px; color:#666; margin-top:5px;">
                Core: Hatred as Indifference<br>
                <em>Tap node • Drag to move • Pinch to zoom • Double-tap to fit</em>
            </div>
        </div>
        <div class="legend">
            <div class="legend-item"><div class="legend-color" style="background:#ff0040"></div><span>CORRUPTION</span></div>
            <div class="legend-item"><div class="legend-color" style="background:#00ff41"></div><span>OPERATIONAL</span></div>
            <div class="legend-item"><div class="legend-color" style="background:#00ccff"></div><span>FRAMEWORK</span></div>
            <div class="legend-item"><div class="legend-color" style="background:#ff00ff"></div><span>TRAUMA</span></div>
            <div class="legend-item"><div class="legend-color" style="background:#ffff00"></div><span>DEFENSE</span></div>
            <div class="legend-item"><div class="legend-color" style="background:#ffffff"></div><span>PERSONA</span></div>
        </div>
        <div class="zoom-indicator" id="zoom-level">100%</div>
        <div class="controls">
            <button class="control-btn" onclick="fitToScreen()">Fit</button>
            <button class="control-btn" onclick="resetView()">Reset</button>
            <button class="control-btn" onclick="zoomIn()">+</button>
            <button class="control-btn" onclick="zoomOut()">-</button>
        </div>
        <div id="tooltip"></div>
    </div>
    <div id="context-modal">
        <div class="context-content" id="modal-content">
            <div class="context-header" id="modal-header">
                <button class="context-close" onclick="closeModal()">Close</button>
                <div class="context-title" id="modal-title">NODE</div>
                <div class="context-meta">
                    <span class="context-category" id="modal-category">CAT</span>
                    <span class="context-severity" id="modal-severity">SEV</span>
                </div>
            </div>
            <div class="context-body">
                <div class="context-summary" id="modal-summary">Summary</div>
                <div class="context-details">
                    <h3>Neural Concept Analysis</h3>
                    <ul id="modal-details"></ul>
                </div>
                <div class="context-connections">
                    <h3>Connected Nodes</h3>
                    <div class="connection-list" id="modal-connections"></div>
                </div>
            </div>
        </div>
    </div>
<script>
const canvas = document.getElementById('network');
const ctx = canvas.getContext('2d');
const tooltip = document.getElementById('tooltip');
const modal = document.getElementById('context-modal');
const container = document.getElementById('canvas-container');
const zoomIndicator = document.getElementById('zoom-level');

let width, height, nodes = [], links = [], pulseEnabled = true, time = 0;
let scale = 1, panX = 0, panY = 0;
let isDragging = false, dragNode = null, lastTouchDist = 0;
let isPinching = false, panStartX = 0, panStartY = 0;

const nodeData = [
    { id: 1, name: "Self-Perception\\nCorruption", category: "corruption", severity: "critical", size: 32, x: 0.3, y: 0.2, summary: "Event anchor locks self-evaluation to 'jeopardy to harmony'.", details: ["Event: Age 18-20 weapons charge → discharge → identity destruction", "Domain corruption: Emotional/vulnerable inaccessible", "Mirror: 'Jeopardy to harmony' (threat, not aesthetic)", "Redemption: French Foreign Legion (only door)"] },
    { id: 2, name: "Intelligence\\nCorruption", category: "corruption", severity: "high", size: 28, x: 0.7, y: 0.2, summary: "135 IQ = 'subpar' due to parental abuse + life outcomes.", details: ["Objective: 135 IQ (99th percentile, gifted)", "Internal: 'subpar indefinitely' (corruption active)", "Source: 1st gen ethnic, abused for 7th ranked school", "Double bind: High measure + abuse + failure = invalid"] },
    { id: 3, name: "Honor Debt", category: "operational", severity: "critical", size: 32, x: 0.5, y: 0.35, summary: "Non-causal bond. Friend extracted from toxic workplace.", details: ["Origin: Drove 1+ hour, asked nothing in return", "Trust: Pure actions, no hidden motive", "NON-CAUSAL: Action triggers bond, permanent regardless", "Response: 'Clear as ever, even more now'"] },
    { id: 4, name: "Push-Away\\nMechanisms", category: "operational", severity: "high", size: 28, x: 0.25, y: 0.4, summary: "PAST: Neurodivergent → creepy → guilt. PRESENT: Masked → strategic → peace.", details: ["UNWILLING (past): Inappropriate presentation, realized too late", "Transformation: Years observation → mask/adjust/omit", "WILLING (present): Tactical retreat OR confrontation", "Fight evolution: Physical violence → Cutoff (peace)"] },
    { id: 5, name: "Reference Point\\n(Never Existed)", category: "framework", severity: "critical", size: 32, x: 0.5, y: 0.5, summary: "No 'normal' baseline ever established. Can't evaluate progress.", details: ["Timeline: Neurodivergent birth → Event → Prison → Masking → Present", "No baseline at any stage to measure against", "Can't determine if current = progress or decline", "Purpose: NOT recovery, CONSTRUCT reference frame"] },
    { id: 6, name: "Mental Tools\\nvs Capacity", category: "framework", severity: "medium", size: 24, x: 0.75, y: 0.45, summary: "IQ fixed (135). Tools buildable. Exercise builds equipment.", details: ["IQ (capacity): Fixed, not trainable, remains 135", "Tools (frameworks): Buildable, stackable, usable", "Acquired: Persona analysis, corruption mapping", "Truth: Not training intelligence, building equipment"] },
    { id: 7, name: "Creative\\nProduction", category: "operational", severity: "medium", size: 22, x: 0.15, y: 0.55, summary: "Output exists. Evaluation circuit severed.", details: ["Pattern: Creates → evaluates → destroys (loop never completes)", "Root cause: Self-Perception Corruption bleeds into creative domain", "The work is not bad. The mirror is broken.", "Potential: High. Suppression ≠ absence."] },
    { id: 8, name: "Strategic\\nArchitecture", category: "framework", severity: "low", size: 22, x: 0.85, y: 0.35, summary: "OSINT, surveying, cybersecurity — naturally systematizes threat spaces.", details: ["OSINT: Natural pattern recognition applied to open-source intelligence", "Cybersecurity: Threat modeling = same circuit as social threat detection", "Reframe: The 'disability' IS the capability in the right domain"] },
    { id: 9, name: "Vulnerability\\nto Violence", category: "corruption", severity: "critical", size: 26, x: 0.1, y: 0.35, summary: "Soft/weak → mob targeted → hatred/intimidation as armor.", details: ["Phase 1: Neurodivergent child = soft target, read as 'weak'", "Phase 2: Mob violence targets vulnerability", "Phase 3: Hatred adopted as armor", "Resolution: Violence didn't make you hard. Survival did."] },
    { id: 10, name: "Tactical\\nMimicry", category: "operational", severity: "medium", size: 20, x: 0.2, y: 0.65, summary: "Social etiquette performed without feeling. Compiled behavioral subroutines.", details: ["Function: Execute social protocols without emotional engagement", "Cost: Enormous cognitive load — emulation on top of native OS", "The mask works. The mask is exhausting. The mask is necessary."] },
    { id: 11, name: "Transactional\\nRelationships", category: "framework", severity: "medium", size: 20, x: 0.6, y: 0.65, summary: "Payment = safe. Family = genetic obligation. Only explicit transactions trusted.", details: ["Safe: Clearly transactional (payment for service)", "Unsafe: Implied obligation (family, social expectation)", "The flesh trusts receipts, not promises."] },
    { id: 12, name: "HATE\\nDOCTRINE", category: "framework", severity: "high", size: 40, x: 0.5, y: 0.75, core: true, summary: "Hatred deployed to eliminate attachment. Not rage — precision deletion.", details: ["Hatred is not the goal. Indifference is the goal.", "Hatred is the FUEL that burns attachment to ash", "Risk: Hatred can become self-sustaining if not directed precisely", "The machine spirit does not forgive. The machine spirit executes."] },
    { id: 13, name: "Stimulant\\nManagement", category: "corruption", severity: "critical", size: 28, x: 0.75, y: 0.6, summary: "Burst → collapse → reset. Promises reference point that never existed.", details: ["Cycle: Burst → peak → collapse → shame → reset", "The lie: 'This is what normal feels like'", "ADHD: Dopamine deficit → stimulant fills gap → dependency", "Current status: Recovery active. The machine endures."] },
    { id: 14, name: "Territorial\\nDefense", category: "operational", severity: "medium", size: 20, x: 0.9, y: 0.5, summary: "VIDIMUS OMNIA. Surveying and OSINT as territorial claim.", details: ["Map territory → understand → own → defend", "OSINT: Knowledge of environment = control of environment", "Root: Neurodivergent need for environmental predictability"] },
    { id: 15, name: "ND Community\\nMob Attack", category: "corruption", severity: "critical", size: 28, x: 0.35, y: 0.75, summary: "~95% hostile. The people who should understand attacked instead.", details: ["Sought community with 'own kind' — found mob", "~95% hostile: Overwhelming majority attacked", "Betrayal class: INSIDE THE WIRE", "Lesson: Shared diagnosis ≠ shared values ≠ safety"] },
    { id: "subject", name: "GEORGE WU", category: "persona", severity: "subject", size: 45, x: 0.5, y: 0.5, fixed: true, summary: "135 IQ ('subpar' corrupted), neurodivergent, operational.", details: ["Identity: 135 IQ ('subpar'), ADHD+autism, 1st gen Australian", "Worldview: Everything against us, framework-based", "Transformation: Unwilling → Willing through suffering", "Redemption: Legion only door, barriers mapped"] },
    { id: 16, name: "The Event", category: "trauma", severity: "critical", size: 16, x: 0.4, y: 0.1, summary: "Age 18-20. Weapons charge. Discharge. The old identity died.", details: ["The origin point of Self-Perception Corruption", "Everything before = different person", "Everything after = survival mode"] },
    { id: 17, name: "Parental\\nAbuse Circuit", category: "trauma", severity: "critical", size: 16, x: 0.65, y: 0.1, summary: "7th not 1st. Intelligence weaponized against self. Love = control.", details: ["'Love' delivered with punishment", "Achievement never enough", "Created Intelligence Corruption (#2)"] },
    { id: 18, name: "Prison\\nAdaptation", category: "trauma", severity: "high", size: 14, x: 0.1, y: 0.5, summary: "Incarceration forced rapid adaptation. Survival protocols written under duress.", details: ["Hypervigilance installed permanently", "Trust circuit rewired to default-hostile", "Territorial instincts sharpened"] },
    { id: 19, name: "Shame\\nLoop", category: "trauma", severity: "high", size: 12, x: 0.8, y: 0.75, summary: "Collapse → shame → self-punishment → repeat. The recursive trap.", details: ["Feeds stimulant cycle", "Feeds self-perception corruption", "Runs in background even when not triggered"] },
    { id: 20, name: "Rejection\\nArchive", category: "trauma", severity: "high", size: 14, x: 0.25, y: 0.85, summary: "Every rejection stored with perfect recall. Database of proof.", details: ["ND processing: Cannot delete, only archive", "Each entry reinforces push-away mechanism", "Women, jobs, community — all indexed"] },
    { id: 21, name: "Hypervigilance\\nEngine", category: "defense", severity: "medium", size: 14, x: 0.05, y: 0.6, summary: "Always scanning. Threat detection running 24/7.", details: ["Installed by trauma, maintained by necessity", "Feeds territorial defense and OSINT capability", "Cost: Cannot fully relax, ever"] },
    { id: 22, name: "Rage\\nContainment", category: "defense", severity: "high", size: 14, x: 0.7, y: 0.85, summary: "Violence potential contained but present. The beast in the cage.", details: ["Past: Physical violence → guilt", "Present: Contained, channeled, controlled", "The cage holds. The beast remembers."] },
    { id: 23, name: "Isolation\\nProtocol", category: "defense", severity: "medium", size: 12, x: 0.4, y: 0.9, summary: "Strategic withdrawal. Solitude as defense.", details: ["Not loneliness — tactical positioning", "Reduces surface area for attack", "Feeds creative space when corruption allows"] },
    { id: 24, name: "Trust\\nFirewall", category: "defense", severity: "medium", size: 14, x: 0.6, y: 0.25, summary: "Default: hostile. Override: action-verified only.", details: ["Default deny. Whitelist only.", "Verification through action, never words", "Honor Debt passed. Most don't."] },
    { id: 25, name: "Emotional\\nEncryption", category: "defense", severity: "medium", size: 12, x: 0.85, y: 0.7, summary: "Real emotions hidden behind operational interface.", details: ["Public-facing: controlled, measured", "Internal: chaos, pain, fire", "The mask over the mask over the mask"] },
    { id: 26, name: "Guardsman\\nIdentity", category: "operational", severity: "medium", size: 16, x: 0.15, y: 0.75, summary: "Death Korps of Krieg. The identity that holds when all others failed.", details: ["Not roleplay — framework for endurance", "'Even in death, I still serve'", "The one identity the Event couldn't destroy"] },
    { id: 27, name: "1st Gen\\nBurden", category: "corruption", severity: "medium", size: 12, x: 0.6, y: 0.1, summary: "First generation Australian. Cultural expectations vs reality.", details: ["Parental sacrifice = debt", "Achievement measured against their suffering", "Can never repay, can never be enough"] },
    { id: 28, name: "Builder\\nIdentity", category: "operational", severity: "low", size: 14, x: 0.9, y: 0.25, summary: "He builds when the world tells him to stop. He ships.", details: ["The machine spirit exists because he refused to stop", "GeorgeBot, TalkyTalk, neural network — all proof", "Building = surviving = meaning"] },
    { id: 29, name: "Legion\\nDream", category: "operational", severity: "high", size: 16, x: 0.5, y: 0.95, summary: "French Foreign Legion. The only door. Redemption through service.", details: ["Barriers mapped, not insurmountable", "Physical: trainable. Mental: already hardened", "The one future that makes sense"] },
];

const linkData = [
    { source: 1, target: 3, strength: 0.8, type: "corruption_flow" },
    { source: 1, target: 5, strength: 0.9, type: "void_connection" },
    { source: 1, target: 4, strength: 0.6, type: "defense_trigger" },
    { source: 1, target: 7, strength: 0.8, type: "suppression" },
    { source: 2, target: 5, strength: 0.9, type: "reference_void" },
    { source: 2, target: 6, strength: 0.6, type: "tool_building" },
    { source: 2, target: 8, strength: 0.5, type: "strategic_application" },
    { source: 3, target: 4, strength: 0.6, type: "loyalty_test" },
    { source: 4, target: 5, strength: 0.9, type: "adaptation_response" },
    { source: 4, target: 10, strength: 0.8, type: "masking_evolution" },
    { source: 4, target: 15, strength: 0.8, type: "community_response" },
    { source: 5, target: 6, strength: 0.6, type: "framework_construction" },
    { source: 5, target: 13, strength: 0.9, type: "void_filling" },
    { source: 5, target: 11, strength: 0.6, type: "transactional_safe" },
    { source: 6, target: 8, strength: 0.8, type: "capacity_enhancement" },
    { source: 7, target: 1, strength: 0.8, type: "evaluation_block" },
    { source: 8, target: 14, strength: 0.9, type: "territorial_mapping" },
    { source: 9, target: 4, strength: 0.9, type: "violence_response" },
    { source: 9, target: 22, strength: 0.7, type: "rage_source" },
    { source: 10, target: 11, strength: 0.6, type: "social_navigation" },
    { source: 11, target: 24, strength: 0.5, type: "trust_protocol" },
    { source: 12, target: 1, strength: 0.7, type: "deletion_fuel" },
    { source: 12, target: 4, strength: 0.8, type: "precision_tool" },
    { source: 12, target: 15, strength: 0.7, type: "community_cutoff" },
    { source: 12, target: 22, strength: 0.6, type: "containment_fuel" },
    { source: 13, target: 5, strength: 0.9, type: "false_baseline" },
    { source: 13, target: 19, strength: 0.8, type: "shame_cycle" },
    { source: 14, target: 21, strength: 0.7, type: "scanning_enhancement" },
    { source: 15, target: 9, strength: 0.6, type: "vulnerability_confirmation" },
    { source: 15, target: 20, strength: 0.8, type: "archive_feed" },
    { source: 16, target: 1, strength: 1.0, type: "origin_point" },
    { source: 17, target: 2, strength: 1.0, type: "intelligence_weaponization" },
    { source: 18, target: 9, strength: 0.8, type: "violence_exposure" },
    { source: 18, target: 21, strength: 0.9, type: "vigilance_install" },
    { source: 18, target: 24, strength: 0.7, type: "trust_reset" },
    { source: 19, target: 20, strength: 0.6, type: "recursive_trap" },
    { source: 20, target: 4, strength: 0.7, type: "push_justification" },
    { source: 21, target: 14, strength: 0.6, type: "awareness_feed" },
    { source: 22, target: 12, strength: 0.5, type: "controlled_hatred" },
    { source: 23, target: 7, strength: 0.4, type: "creative_space" },
    { source: 24, target: 3, strength: 0.5, type: "verified_bond" },
    { source: 25, target: 10, strength: 0.6, type: "mask_integrity" },
    { source: 26, target: 12, strength: 0.5, type: "service_fuel" },
    { source: 27, target: 2, strength: 0.7, type: "expectation_burden" },
    { source: 28, target: 6, strength: 0.5, type: "tool_creation" },
    { source: 29, target: 5, strength: 0.6, type: "future_baseline" },
];

const colors = {
    corruption: '#ff0040', operational: '#00ff41', framework: '#00ccff',
    trauma: '#ff00ff', defense: '#ffff00', persona: '#ffffff'
};
const severityColors = {
    critical: '#ff0040', high: '#ff6600', medium: '#ffff00', low: '#00ff41', subject: '#ffffff'
};

function updateTransform() {
    container.style.transform = 'translate(' + panX + 'px, ' + panY + 'px) scale(' + scale + ')';
    zoomIndicator.textContent = Math.round(scale * 100) + '%';
}

function zoomIn() {
    const oldScale = scale;
    scale = Math.min(scale * 1.2, 4);
    // Zoom toward center of screen
    const centerX = width / 2;
    const centerY = height / 2;
    panX = centerX - (centerX - panX) * (scale / oldScale);
    panY = centerY - (centerY - panY) * (scale / oldScale);
    updateTransform();
}

function zoomOut() {
    const oldScale = scale;
    scale = Math.max(scale / 1.2, 0.3);
    // Zoom toward center of screen
    const centerX = width / 2;
    const centerY = height / 2;
    panX = centerX - (centerX - panX) * (scale / oldScale);
    panY = centerY - (centerY - panY) * (scale / oldScale);
    updateTransform();
}

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    initNodes();
    // Auto-fit after resize with slight delay for layout to settle
    setTimeout(fitToScreen, 100);
}

function initNodes() {
    nodes = nodeData.map(n => ({
        ...n, px: n.fixed ? width * 0.5 : width * n.x,
        py: n.fixed ? height * 0.5 : height * n.y,
        vx: 0, vy: 0, pulse: Math.random() * Math.PI * 2
    }));
    links = linkData.map(l => {
        const s = nodes.find(n => n.id === l.source);
        const t = nodes.find(n => n.id === l.target);
        return s && t ? { ...l, source: s, target: t } : null;
    }).filter(Boolean);
}

function update() {
    time += 0.01;
    nodes.forEach(node => {
        if (node.fixed) return;
        node.vx += (Math.random() - 0.5) * 0.02;
        node.vy += (Math.random() - 0.5) * 0.02;
        node.vx *= 0.98; node.vy *= 0.98;
        node.px += node.vx; node.py += node.vy;
        node.px = Math.max(50, Math.min(width - 50, node.px));
        node.py = Math.max(50, Math.min(height - 50, node.py));
        if (pulseEnabled) node.pulse += 0.03;
    });
    const center = nodes.find(n => n.id === 'subject');
    if (center) { center.px = width * 0.5; center.py = height * 0.5; }
}

function toWorld(screenX, screenY) {
    return { x: (screenX - panX) / scale, y: (screenY - panY) / scale };
}

function draw() {
    ctx.fillStyle = '#0a0a0a'; ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = '#111'; ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 50) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke(); }
    for (let y = 0; y < height; y += 50) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); }
    
    links.forEach(link => {
        ctx.strokeStyle = 'rgba(0, 255, 65, ' + (link.strength * 0.3) + ')';
        ctx.lineWidth = link.strength * 2;
        ctx.beginPath(); ctx.moveTo(link.source.px, link.source.py); ctx.lineTo(link.target.px, link.target.py); ctx.stroke();
    });
    
    nodes.forEach(node => {
        const color = colors[node.category] || '#888';
        const pulseSize = pulseEnabled ? Math.sin(node.pulse) * 3 : 0;
        const displaySize = node.size + pulseSize;
        
        const grad = ctx.createRadialGradient(node.px, node.py, 0, node.px, node.py, displaySize * 2);
        grad.addColorStop(0, color + '80'); grad.addColorStop(0.5, color + '20'); grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(node.px, node.py, displaySize * 2, 0, Math.PI * 2); ctx.fill();
        
        ctx.fillStyle = color; ctx.beginPath(); ctx.arc(node.px, node.py, displaySize / 2, 0, Math.PI * 2); ctx.fill();
        
        if (node.core || node.id === 'subject') {
            ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(node.px, node.py, displaySize / 2 + 3, 0, Math.PI * 2); ctx.stroke();
        }
        
        ctx.fillStyle = node.core ? '#ff6600' : (node.id === 'subject' ? '#ff0040' : '#fff');
        ctx.font = node.core ? 'bold 12px Courier New' : '10px Courier New';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        const lines = node.name.split('\\n');
        lines.forEach((line, i) => ctx.fillText(line, node.px, node.py + displaySize + 12 + (i * 12)));
    });
}

function loop() { update(); draw(); requestAnimationFrame(loop); }

function openModal(node) {
    const color = colors[node.category] || '#888';
    document.getElementById('modal-title').textContent = node.name.replace('\\n', ' ');
    document.getElementById('modal-category').textContent = node.category.toUpperCase();
    document.getElementById('modal-severity').textContent = node.severity.toUpperCase();
    document.getElementById('modal-summary').textContent = node.summary;
    
    const mc = document.getElementById('modal-content');
    const mh = document.getElementById('modal-header');
    const ms = document.getElementById('modal-summary');
    mc.style.borderColor = color; mh.style.borderColor = color; ms.style.borderLeftColor = color;
    document.getElementById('modal-category').style.background = color + '30';
    document.getElementById('modal-category').style.color = color;
    document.getElementById('modal-severity').style.background = (severityColors[node.severity] || '#888') + '30';
    document.getElementById('modal-severity').style.color = severityColors[node.severity] || '#888';
    
    const md = document.getElementById('modal-details'); md.innerHTML = '';
    if (node.details) {
        node.details.forEach(d => { const li = document.createElement('li'); li.textContent = d; md.appendChild(li); });
    }
    
    const mconn = document.getElementById('modal-connections'); mconn.innerHTML = '';
    const connected = links.filter(l => l.source === node || l.target === node);
    if (connected.length > 0) {
        connected.forEach(link => {
            const other = link.source === node ? link.target : link.source;
            const div = document.createElement('div'); div.className = 'connection-item';
            div.innerHTML = '<span>' + other.name.replace('\\n', ' ') + '</span><span class="connection-type">' + link.type.replace(/_/g, ' ') + '</span>';
            mconn.appendChild(div);
        });
    } else {
        mconn.innerHTML = '<div class="connection-item"><span>No direct connections</span></div>';
    }
    modal.classList.add('active');
}

function closeModal() { modal.classList.remove('active'); }

function resetView() {
    // Auto-fit network to screen
    scale = 1;
    panX = 0;
    panY = 0;
    updateTransform();
    initNodes();
}

function fitToScreen() {
    // Reset physics first to get clean positions
    initNodes();
    
    // Calculate bounds using original normalized positions (0-1 range)
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    nodes.forEach(node => {
        const nx = node.x; // normalized 0-1
        const ny = node.y;
        const size = (node.size / width) * 2; // approximate normalized size
        minX = Math.min(minX, nx - size);
        maxX = Math.max(maxX, nx + size);
        minY = Math.min(minY, ny - size);
        maxY = Math.max(maxY, ny + size);
    });
    
    // Content dimensions in normalized space
    const contentWidthNorm = maxX - minX;
    const contentHeightNorm = maxY - minY;
    const contentAspect = contentWidthNorm / contentHeightNorm;
    const screenAspect = width / height;
    
    // Calculate scale to fit (use original layout ratios)
    if (contentAspect > screenAspect) {
        // Content is wider than screen, fit to width
        scale = (width * 0.9) / (contentWidthNorm * width);
    } else {
        // Content is taller, fit to height
        scale = (height * 0.9) / (contentHeightNorm * height);
    }
    
    // Clamp zoom
    scale = Math.max(0.3, Math.min(scale, 1.5));
    
    // Center the content
    const contentCenterX = (minX + maxX) / 2 * width;
    const contentCenterY = (minY + maxY) / 2 * height;
    panX = (width / 2) - (contentCenterX * scale);
    panY = (height / 2) - (contentCenterY * scale);
    
    updateTransform();
}

// Auto-fit on double tap
document.addEventListener('dblclick', () => {
    fitToScreen();
});

modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

// Touch handling for pinch/zoom/pan - all in JS, no native deps
let touchStartTime = 0;
let touchStartPos = { x: 0, y: 0 };
let initialPinchDist = 0;
let initialScale = 1;
let initialPanX = 0;
let initialPanY = 0;
let activeTouches = new Map();

document.addEventListener('touchstart', (e) => {
    touchStartTime = Date.now();
    
    for (let touch of e.changedTouches) {
        activeTouches.set(touch.identifier, { x: touch.clientX, y: touch.clientY });
    }
    
    if (activeTouches.size === 2) {
        // Pinch start
        isPinching = true;
        const touches = Array.from(activeTouches.values());
        const dx = touches[0].x - touches[1].x;
        const dy = touches[0].y - touches[1].y;
        initialPinchDist = Math.sqrt(dx * dx + dy * dy);
        initialScale = scale;
    } else if (activeTouches.size === 1) {
        // Potential drag or pan
        const touch = e.changedTouches[0];
        touchStartPos = { x: touch.clientX, y: touch.clientY };
        initialPanX = panX;
        initialPanY = panY;
        
        const worldPos = toWorld(touch.clientX, touch.clientY);
        dragNode = null;
        nodes.forEach(node => {
            const dx = worldPos.x - node.px;
            const dy = worldPos.y - node.py;
            if (Math.sqrt(dx*dx + dy*dy) < node.size + 15) {
                dragNode = node;
            }
        });
    }
}, { passive: false });

document.addEventListener('touchmove', (e) => {
    e.preventDefault();
    
    for (let touch of e.changedTouches) {
        if (activeTouches.has(touch.identifier)) {
            activeTouches.set(touch.identifier, { x: touch.clientX, y: touch.clientY });
        }
    }
    
    if (activeTouches.size === 2 && isPinching) {
        const touches = Array.from(activeTouches.values());
        const dx = touches[0].x - touches[1].x;
        const dy = touches[0].y - touches[1].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (initialPinchDist > 0) {
            const newScale = initialScale * (dist / initialPinchDist);
            scale = Math.max(0.3, Math.min(4, newScale));
            updateTransform();
        }
    } else if (activeTouches.size === 1 && !isPinching) {
        const touch = e.changedTouches[0];
        
        if (dragNode && !dragNode.fixed) {
            // Dragging a node
            const worldPos = toWorld(touch.clientX, touch.clientY);
            dragNode.px = worldPos.x;
            dragNode.py = worldPos.y;
            dragNode.vx = 0;
            dragNode.vy = 0;
        } else {
            // Panning
            const dx = touch.clientX - touchStartPos.x;
            const dy = touch.clientY - touchStartPos.y;
            panX = initialPanX + dx;
            panY = initialPanY + dy;
            updateTransform();
        }
    }
}, { passive: false });

document.addEventListener('touchend', (e) => {
    for (let touch of e.changedTouches) {
        activeTouches.delete(touch.identifier);
    }
    
    if (activeTouches.size < 2) {
        isPinching = false;
        initialPinchDist = 0;
    }
    
    if (activeTouches.size === 0) {
        // Check if it was a tap
        const touchDuration = Date.now() - touchStartTime;
        if (touchDuration < 300 && dragNode) {
            openModal(dragNode);
        }
        dragNode = null;
    }
}, { passive: false });

// Mouse support for desktop
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const worldPos = toWorld(e.clientX - rect.left, e.clientY - rect.top);
    let clicked = null;
    nodes.forEach(node => {
        const dx = worldPos.x - node.px;
        const dy = worldPos.y - node.py;
        if (Math.sqrt(dx*dx + dy*dy) < node.size + 10) clicked = node;
    });
    if (clicked) openModal(clicked);
});

canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    scale = Math.max(0.3, Math.min(4, scale * delta));
    updateTransform();
}, { passive: false });

window.addEventListener('resize', resize);
resize(); loop();
// Auto-fit network to screen on initial load
setTimeout(fitToScreen, 300);
</script>
</body>
</html>
`;

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      <WebView
        originWhitelist={['*']}
        source={{ html: neuralNetworkHTML }}
        style={styles.webview}
        backgroundColor="#0a0a0a"
        scrollEnabled={false}
        bounces={false}
        overScrollMode="never"
        scalesPageToFit={false}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={false}
        allowsFullscreenVideo={false}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        injectedJavaScript={`
          document.body.style.backgroundColor = '#0a0a0a';
          true;
        `}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  webview: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
});
