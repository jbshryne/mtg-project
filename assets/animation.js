const DURATION = 300; // ms
const EASING = "swing";

function px(n) {
  return Math.max(0, Math.round(n)) + "px";
}

// Helper: measure the natural outer width of an element by cloning it offscreen
function naturalOuterWidth($el) {
  const $clone = $el
    .clone()
    .css({
      position: "absolute",
      visibility: "hidden",
      left: "-99999px",
      top: "-99999px",
      width: "auto",
      maxWidth: "none",
      display: "inline-flex",
    })
    .appendTo(document.body);
  const w = $clone.outerWidth(true);
  $clone.remove();
  return w;
}

// Compute collapsed (label) and expanded (content) widths for each control
function computeSizes($rc) {
  // horizontal padding + border to add on top of content widths
  const cs = getComputedStyle($rc[0]);
  const padBorderX =
    parseFloat(cs.paddingLeft) +
    parseFloat(cs.paddingRight) +
    parseFloat(cs.borderLeftWidth) +
    parseFloat(cs.borderRightWidth);

  const $label = $rc.find(".rc-label");
  const $content = $rc.find(".rc-content");

  // Measure natural widths
  const labelW = naturalOuterWidth($label);
  const contentW = naturalOuterWidth($content);

  // Store targets
  const collapsedW = labelW + padBorderX;
  const expandedW = contentW + padBorderX;

  $rc.data({ collapsedW, expandedW });

  // Initialize to collapsed width on first run
  if (!$rc.data("initialized")) {
    $rc.css("width", px(collapsedW));
    $rc.attr("aria-expanded", "false");
    $rc.data("initialized", true);
  }
}

// Expand/collapse with animation
function expand($rc) {
  if ($rc.hasClass("expanded")) return;

  const { expandedW } = $rc.data();
  $rc
    .stop(true)
    .addClass("expanded")
    .attr("aria-expanded", "true")
    .animate({ width: px(expandedW) }, DURATION, EASING);
}

function collapse($rc) {
  if (!$rc.hasClass("expanded")) return;

  const { collapsedW } = $rc.data();
  $rc
    .stop(true)
    .removeClass("expanded")
    .attr("aria-expanded", "false")
    .animate({ width: px(collapsedW) }, DURATION, EASING);
}

const AnimationHelpers = {
  computeSizes,
  expand,
  collapse,
};

Window.AnimationHelpers = AnimationHelpers;
