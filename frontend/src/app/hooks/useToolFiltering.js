import { useState, useCallback, useEffect } from 'react';
import { CATEGORY_GROUPS } from '../utils/constants';

export const useToolFiltering = () => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('personal');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [initialized, setInitialized] = useState(false);

  // This effect only runs once on component mount
  useEffect(() => {
    // Initial fetch on mount - only once
    if (!initialized) {
      setLoading(true);
      setInitialized(true);
      fetchData(selectedFilter, selectedCategory);
    }
  }, [initialized, selectedFilter, selectedCategory]);

  // Separate function for data fetching (not a useCallback to avoid dependency issues)
  const fetchData = async (filter, category) => {
    try {
      // Build the endpoint URL based on current selections
      let endpoint = `/api/tools?type=${filter}`;

      // Handle special category IDs for all tools in a group
      if (category === 'sports_all') {
        endpoint += '&group=sports';
      }
      else if (category === 'ai_all') {
        endpoint += '&group=ai';
      }
      else if (category && category !== '') {
        endpoint += `&sector=${encodeURIComponent(category)}`;
      }

      console.log('Fetching tools from:', endpoint);

      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      console.log(`Fetched ${data?.length || 0} tools`);

      if (data.error) {
        throw new Error(data.error);
      }

      setTools(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching tools:', err);
      setError(err.message || 'Failed to fetch tools');
      setTools([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle filter type change (Personal/Enterprise)
  const handleFilterChange = (filter) => {
    setLoading(true);
    setSelectedFilter(filter);

    // Reset or set appropriate category
    const newCategory = filter === 'personal' ? '' : 'sports_all';
    setSelectedCategory(newCategory);

    // Fetch with new filter and category
    fetchData(filter, newCategory);
  };

  // Handle category selection change
  const handleCategoryChange = (category) => {
    setLoading(true);

    try {
      console.log('Category changed to:', category);

      // Determine the current group (sports or AI)
      const currentGroup = category === 'sports_all' ||
        CATEGORY_GROUPS.SPORTS.some(c => c.id === category) ? 'sports' : 'ai';

      // If switching to 'all' within the same group, set to the all category
      let newCategory;
      if (category === 'sports_all' || category === 'ai_all') {
        newCategory = category;
      } else {
        // Check if the category exists in the current group
        const isValidCategory = currentGroup === 'sports'
          ? CATEGORY_GROUPS.SPORTS.some(c => c.id === category)
          : CATEGORY_GROUPS.AI.some(c => c.id === category);

        // If valid category, set it. Otherwise, set to the corresponding 'all' category
        newCategory = isValidCategory ? category : (currentGroup === 'sports' ? 'sports_all' : 'ai_all');
      }

      setSelectedCategory(newCategory);

      // Fetch with new category
      fetchData(selectedFilter, newCategory);
    } catch (err) {
      console.error('Error changing category:', err);
      setLoading(false);
    }
  };

  return {
    tools,
    loading,
    error,
    selectedFilter,
    selectedCategory,
    setSelectedFilter: handleFilterChange,
    setSelectedCategory: handleCategoryChange,
    fetchTools: () => {
      setLoading(true);
      fetchData(selectedFilter, selectedCategory);
    }
  };
};