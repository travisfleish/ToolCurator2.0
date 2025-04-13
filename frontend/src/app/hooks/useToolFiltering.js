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

      // For enterprise view, always get all AI tools
      if (filter === 'enterprise') {
        endpoint += '&group=ai'; // Always fetch all AI tools for enterprise view
      }
      // For personal view, keep the original category filtering logic
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

    // Reset category for both personal and enterprise
    setSelectedCategory('');

    // Fetch with new filter
    fetchData(filter, '');
  };

  // Handle category selection change - simplified since we're not using CategoryFilters anymore
  const handleCategoryChange = (category) => {
    setLoading(true);
    setSelectedCategory(category);
    fetchData(selectedFilter, category);
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