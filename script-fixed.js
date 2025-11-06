// Fixed client-side filtering for OUE Restaurants Private Events
// Replaces broken Finsweet CMS Filter implementation

document.addEventListener('DOMContentLoaded', function() {
    const sittingSlider = document.getElementById('sitting-slider');
    const standingSlider = document.getElementById('standing-slider');
    const sittingDisplay = document.getElementById('sitting-display');
    const standingDisplay = document.getElementById('standing-display');
    const areaFilters = document.querySelectorAll('.area-filter');
    const amenityFilters = document.querySelectorAll('.amenity-filter');
    const venueCards = document.querySelectorAll('.event-card');
    const noResults = document.getElementById('no-results');
    
    let filters = {
        sitting: 1,
        standing: 1,
        areas: [],
        amenities: []
    };

    // Update slider displays
    sittingSlider.addEventListener('input', function() {
        filters.sitting = parseInt(this.value);
        sittingDisplay.textContent = filters.sitting;
        applyFilters();
    });

    standingSlider.addEventListener('input', function() {
        filters.standing = parseInt(this.value);
        standingDisplay.textContent = filters.standing;
        applyFilters();
    });

    // Area checkboxes
    areaFilters.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                filters.areas.push(this.value);
            } else {
                filters.areas = filters.areas.filter(a => a !== this.value);
            }
            applyFilters();
        });
    });

    // Amenity checkboxes
    amenityFilters.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                filters.amenities.push(this.value);
            } else {
                filters.amenities = filters.amenities.filter(a => a !== this.value);
            }
            applyFilters();
        });
    });

    // Main filter function - Fixed logic with AND operator
    function applyFilters() {
        let visibleCount = 0;

        venueCards.forEach(card => {
            const venueSitting = parseInt(card.getAttribute('data-sitting'));
            const venueStanding = parseInt(card.getAttribute('data-standing'));
            const venueArea = card.getAttribute('data-area').split(',').map(a => a.trim());
            const venueAmenities = card.getAttribute('data-amenities').split(',').map(a => a.trim()).filter(a => a !== '');

            // Check capacity (venue must meet or exceed filter value)
            const sittingMatch = venueSitting >= filters.sitting;
            const standingMatch = venueStanding >= filters.standing;

            // Check area (if filters selected, venue must match at least one)
            let areaMatch = true;
            if (filters.areas.length > 0) {
                areaMatch = filters.areas.some(filterArea => venueArea.includes(filterArea));
            }

            // Check amenities (if filters selected, venue must have ALL selected)
            let amenitiesMatch = true;
            if (filters.amenities.length > 0) {
                amenitiesMatch = filters.amenities.every(filterAmenity => 
                    venueAmenities.includes(filterAmenity)
                );
            }

            // Show card if ALL conditions match (AND logic)
            if (sittingMatch && standingMatch && areaMatch && amenitiesMatch) {
                card.classList.remove('hidden');
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.classList.add('hidden');
                card.style.display = 'none';
            }
        });

        // Show/hide no results message
        noResults.style.display = visibleCount === 0 ? 'block' : 'none';

        console.log('Filters Applied:', {
            sitting: filters.sitting,
            standing: filters.standing,
            areas: filters.areas,
            amenities: filters.amenities,
            visibleVenues: visibleCount
        });
    }

    // Initialize
    applyFilters();
    console.log('✅ Filter initialized - Total venues:', venueCards.length);
});
