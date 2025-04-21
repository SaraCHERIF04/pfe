from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from ..models import Budget
from ..serializers.budget_serializer import BudgetSerializer

class BudgetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'per_page'
    page_query_param = 'page'
    max_page_size = 100

class BudgetView(APIView):
    permission_classes = [IsAuthenticated]
    pagination_class = BudgetPagination

    def get_paginated_response(self, data):
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(data, self.request)
        if page is not None:
            return paginator.get_paginated_response(page)
        return Response(data)

    def get(self, request, pk=None):
        if pk:
            return self.get_single_budget(request, pk)
        return self.get_all_budgets()

    def get_single_budget(self, request, pk):
        budget = self.get_object(pk)
        if not budget:
            return Response({
                'success': False,
                'message': 'Budget not found'
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = BudgetSerializer(budget)
        return Response({
            'success': True,
            'message': 'Budget retrieved successfully',
            'data': serializer.data
        }, status=status.HTTP_200_OK)

    def get_all_budgets(self):
        budgets = Budget.objects.all()
        serializer = BudgetSerializer(budgets, many=True)
        
        paginated_response = self.get_paginated_response(serializer.data)
        if isinstance(paginated_response, Response):
            return Response({
                'success': True,
                'message': 'Budgets retrieved successfully',
                'data': paginated_response.data
            }, status=status.HTTP_200_OK)
        
        return paginated_response

    def post(self, request):
        serializer = BudgetSerializer(data=request.data)
        if serializer.is_valid():
            budget = serializer.save()
            return Response({
                'success': True,
                'message': 'Budget created successfully',
                'data': BudgetSerializer(budget).data
            }, status=status.HTTP_201_CREATED)

        return Response({
            'success': False,
            'message': 'Invalid data',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        budget = self.get_object(pk)
        if not budget:
            return Response({
                'success': False,
                'message': 'Budget not found'
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = BudgetSerializer(budget, data=request.data)
        if serializer.is_valid():
            budget = serializer.save()
            return Response({
                'success': True,
                'message': 'Budget updated successfully',
                'data': BudgetSerializer(budget).data
            }, status=status.HTTP_200_OK)

        return Response({
            'success': False,
            'message': 'Invalid data',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        budget = self.get_object(pk)
        if not budget:
            return Response({
                'success': False,
                'message': 'Budget not found'
            }, status=status.HTTP_404_NOT_FOUND)

        budget.delete()
        return Response({
            'success': True,
            'message': 'Budget deleted successfully'
        }, status=status.HTTP_204_NO_CONTENT)

    def get_object(self, pk):
        try:
            return Budget.objects.get(pk=pk)
        except Budget.DoesNotExist:
            return None 